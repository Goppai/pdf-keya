import React, { Component, useContext } from 'react';
import _ from 'lodash';
import {
  DocWithData,
  DocWithErrors,
  Document,
  ResourceObject,
  Link,
  PaginationLinks,
} from 'jsonapi-typescript';

import { ClientContext, ClientDef } from './client';

const dataAPI = '/v1/data';
const refAPI = '/v1/references';

interface DocRep {
  id?: string;
  type: string;
  rev: string;
  [propName: string]: any;
}

interface RevObject extends ResourceObject<string> {
  rev: string;
}

interface CRUDProps {
  readonly children: (
    e: Error | null,
    props: {
    isLoading: boolean;
    docs: DocRep[];
    hasMore?: boolean;
    },
    funcs: {},
  ) => JSX.ElementClass;
  readonly docType: string;
  client: ClientDef;
}

interface DataProps extends CRUDProps {}

interface ReferenceProps extends CRUDProps {
  readonly object: DocRep;
}

interface State {
  isLoading: boolean;
  docs: DocRep[];
  error: Error | null;
  next?: Link | null;
  retry?: (() => Promise<DocRep[]>) | null;
}

function flattenData(data: RevObject[] | null): DocRep[] {
  if (!data) {
    return [];
  }

  return data.map(d => ({
    id: d.id,
    rev: d.rev,
    type: d.type,
    meta: d.meta,
    ...d.attributes,
  }));
}

class CRUD<P extends CRUDProps> extends Component<P, State> {
  private loadingRef: number = 0;

  state = {
    isLoading: false,
    docs: [],
    error: null /* eslint-disable-line react/no-unused-state */,
    next: null /* eslint-disable-line react/no-unused-state */,
    retry: null /* eslint-disable-line react/no-unused-state */,
  };

  docType: string = '';

  constructor(props: P) {
    super(props);

    if (!props.client) {
      throw new Error('CRUD Component: no client in props');
    }

    this.client = props.client;
    this.docType = props.docType;
  }

  get isLoading() {
    return this.loadingRef > 0;
  }

  client: ClientDef;

  pushLoading() {
    this.loadingRef += 1;
    const { isLoading } = this.state;
    if (!isLoading) {
      this.setState({ isLoading: true });
    }
  }

  popLoading<K extends keyof State>(s?: Pick<State, K>) {
    this.loadingRef -= 1;
    if (this.loadingRef === 0) {
      this.setState({ ...(s || {}), isLoading: false });
    } else {
      this.setState(s || {});
    }
  }

  async exec(
    fn: (c: ClientDef, d: string) => Promise<Document>,
    post?: (d: RevObject[]) => void,
  ): Promise<DocRep[]> {
    const { client, docType } = this;
    try {
      this.pushLoading();
      const ret = await fn(client, docType);
      const { data } = ret as DocWithData<RevObject[]>;
      const { errors } = ret as DocWithErrors;

      if (errors) {
        const reason = errors.length > 0 && errors[0].detail ? errors[0].detail : 'Unknown server error';
        this.popLoading({
          error: new Error(reason),
          retry: () => this.exec(fn),
        });
      } else if (post) {
        post(data);
        return flattenData(data);
      } else {
        // TODO local cache
        const { docs } = this.state;
        const newDocs = _.concat(docs, flattenData(data));
        const { links } = ret as DocWithData<RevObject[]>;
        const { next } = (links || {}) as PaginationLinks;
        this.popLoading({ docs: newDocs, next });
        return newDocs;
      }
    } catch (error) {
      this.popLoading({ error });
    }
    return [];
  }
}

const createDocument = (client: ClientDef, docType: string) => (payload: object) => client.fetchJSON('POST', `${dataAPI}/${docType}/create`, { data: payload });
const readDocument = (client: ClientDef, docType: string) => async (
  id: string,
): Promise<Document> => client.fetchJSON('GET', `${dataAPI}/${docType}/${id}`);
const updateDocument = (client: ClientDef, docType: string) => (id: string, payload: object) => client.fetchJSON('PUT', `${dataAPI}/${docType}/${id}`, { data: payload });

class Data extends CRUD<DataProps> {
  componentDidMount() {
    this.listDocuments();
  }

  render() {
    if (!this.state) {
      return <div>Loading</div>;
    }

    const { children } = this.props;
    const { docs, isLoading, error } = this.state;
    return children(
      error,
      { docs, isLoading },
      {
        createDoc: this.createDocument.bind(this),
        readDoc: this.readDocument.bind(this),
        updateDoc: this.updateDocument.bind(this),
        allDocs: this.listDocuments.bind(this),
      },
    );
  }

  async listDocuments(): Promise<RevObject[]> {
    return this.exec((client, docType) => client.fetchJSON('GET', `${dataAPI}/${docType}/all`));
  }

  async createDocument(doc: object, id?: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const payload = [
      {
        id,
        type: docType,
        attributes: doc,
      },
    ];

    await createDocument(client, docType)(payload);
    return this.listDocuments();
  }

  async readDocument(id: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const ret = await readDocument(client, docType)(id);
    const { data } = ret as DocWithData<RevObject[]>;
    return flattenData(data);
  }

  async updateDocument(doc: object, id: string, rev: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const payload = [
      {
        id,
        type: docType,
        meta: { rev },
        attributes: doc,
      },
    ];

    await updateDocument(client, docType)(id, payload);
    return this.listDocuments();
  }
}

class References extends CRUD<ReferenceProps> {
  constructor(props: ReferenceProps) {
    super(props);

    if (!props.client) {
      throw new Error('Data Component: no client in props');
    }

    this.client = props.client as ClientDef;
    this.docType = props.docType;
    this.setState({
      isLoading: false,
    });
  }

  componentDidMount() {
    this.getLinkedDocuments();
  }

  render() {
    if (!this.state) {
      return <div>Loading</div>;
    }

    const { children } = this.props;
    const { docs, isLoading, error } = this.state;
    return children(
      error,
      { docs, isLoading },
      {
        linkDocs: this.linkDocuments.bind(this),
        unlinkDocs: this.unlinkDocuments.bind(this),
        getLinkedDocs: this.getLinkedDocuments.bind(this),
      },
    );
  }

  async linkDocuments(targets: DocRep[]): Promise<RevObject[]> {
    const { type, id } = this.props.object;
    if (!targets || targets.length === 0) {
      return [];
    }

    return this.exec(
      (client, docType) => {
        const data = targets.map(x => ({
          id: x,
          type: docType,
        }));
        const path = `${refAPI}/${type}/${id}`;
        return client.fetchJSON('POST', path, { data });
      },
      () => this.getLinkedDocuments(),
    );
  }

  async unlinkDocuments(targets: DocRep[]): Promise<RevObject[]> {
    if (!targets || targets.length === 0) {
      return [];
    }

    return this.exec(
      (client, docType) => {
        const { type, id } = this.props.object;
        const path = `${refAPI}/${type}/${id}`;
        const all = targets.map(x => client.fetchJSON('DELETE', path, {
          data: [{ id: x, type: docType }],
        }));
        return _.merge(Promise.all(all));
      },
      () => this.getLinkedDocuments(),
    );
  }

  async getLinkedDocuments() {
    return this.exec((client, docType) => {
      const { type, id } = this.props.object;
      const path = `${refAPI}/${type}/${id}`;
      const query = `doctype=${docType}`;
      return client.fetchJSON('GET', `${path}?${query}`);
    });
  }
}

interface ViewProps extends CRUDProps {
  readonly view: string;
  readonly query: { [key: string]: string };
  readonly loadingIndicator?: React.ReactNode;
}

function encodeToQueryParam(s: any) {
  if (_.isString(s)) {
    return s;
  }
  return JSON.stringify(s);
}

class ViewClass extends CRUD<ViewProps> {
  componentDidMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps: ViewProps) {
    if (nextProps.query !== this.props.query || nextProps.view !== this.props.view) {
      this.load(nextProps);
    }
  }

  render() {
    if (!this.state) {
      return <div>Loading</div>;
    }

    const { children } = this.props;
    const {
      docs, isLoading, error, next, retry,
    } = this.state;
    return children(
      error,
      { docs, isLoading, hasMore: !!next },
      {
        retry,
        loadMore: this.loadMore.bind(this),
        createDoc: this.createDocument.bind(this),
        readDoc: this.readDocument.bind(this),
        updateDoc: this.updateDocument.bind(this),
      },
    );
  }

  async loadMore() {
    const { next } = this.state;
    return this.exec(async (client) => {
      // To debug loading spinner
      //
      // await new Promise(resolve => {
      //   setTimeout(() => {
      //     resolve('a')
      //   }, 1000000)
      // }).then(x => {
      //   console.log(x)
      // })
      if (next) {
        return client.fetchJSON('GET', next || '');
      }
      return { data: [] };
    });
  }

  async load(props: ViewProps) {
    // TODO fix this setState
    this.setState({ docs: [], next: null });

    return this.exec(async (client, docType) => {
      const { query, view } = props;
      const path = `${dataAPI}/${docType}/view`;
      const param = Object.entries({ ...query, view })
        .map(([key, val]) => `${key}=${encodeToQueryParam(val)}`)
        .join('&');
      return client.fetchJSON('GET', `${path}?${param}`);
    });
  }

  async createDocument(doc: object, id?: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const payload = [
      {
        id,
        type: docType,
        attributes: doc,
      },
    ];

    await createDocument(client, docType)(payload);
    return this.load(this.props);
  }

  async readDocument(id: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const ret = await readDocument(client, docType)(id);
    const { data } = ret as DocWithData<RevObject[]>;
    return flattenData(data);
  }

  async updateDocument(doc: object, id: string, rev: string): Promise<RevObject[]> {
    const { client, docType } = this;
    const payload = [
      {
        id,
        type: docType,
        meta: { rev },
        attributes: doc,
      },
    ];

    await updateDocument(client, docType)(id, payload);
    return this.load(this.props);
  }
}

const View = (props: ViewProps) => {
  const client = useContext<ClientDef>(ClientContext);
  return <ViewClass {...props} client={client} />;
};

export { Data, View, References };
