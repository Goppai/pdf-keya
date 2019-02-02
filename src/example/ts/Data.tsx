import React, { Component } from 'react';
import * as _ from 'lodash';

import {
  DocWithData,
  DocWithErrors,
  Document,
  ResourceObject
} from 'jsonapi-typescript';

const dataAPI = `/v1/data`;
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

// class SealContext implements Context<{client: { stackClient: Client }}> {
//   Provider
// }

interface CRUDProps {
  readonly children: (
    e: Error | null,
    props: {
      isLoading: boolean;
      docs: DocRep[];
    },
    funcs: {}
  ) => JSX.ElementClass;
  readonly docType: string;
  readonly client: Client;
}

interface DataProps extends CRUDProps {}

interface ReferenceProps extends CRUDProps {
  readonly object: DocRep;
}

// class State {
//   isLoading: boolean = true;
//   docs: DocRep[] = [];
//   error?: Error;
// }

interface State {
  isLoading: boolean;
  docs: DocRep[];
  error: Error | null;
}

interface Client {
  fetchJSON: (
    method: string,
    path: string,
    payload?: object
  ) => Promise<Document>;
}

class CRUD<P extends CRUDProps> extends Component<P, State> {
  private loadingRef: number = 0;
  docType: string = '';
  client: Client;

  state = {
    isLoading: false,
    docs: [],
    error: null
  };

  constructor(props: P) {
    super(props);

    if (!props.client) {
      throw new Error('Data Component: no client in props');
    }

    this.client = props.client as Client;
    this.docType = props.docType;
    this.setState({
      isLoading: false
    });
  }

  pushLoading() {
    ++this.loadingRef;
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
    }
  }

  popLoading() {
    if (--this.loadingRef === 0) {
      this.setState({ isLoading: false });
    }
  }

  flattenData(data: RevObject[] | null): DocRep[] {
    if (!data) {
      return [];
    }

    return data.map(d => ({
      id: d.id,
      rev: d.rev,
      type: d.type,
      ...d.attributes
    }));
  }

  async exec(
    fn: (c: Client, d: string) => Promise<Document>,
    post?: (d: RevObject[]) => void
  ): Promise<DocRep[]> {
    const { client, docType } = this;
    try {
      this.pushLoading();
      const ret = await fn(client, docType);
      const data = (ret as DocWithData<RevObject[]>).data;
      const errors = (ret as DocWithErrors).errors;
      this.popLoading();

      if (errors) {
        const reason =
          errors.length > 0 && errors[0].detail
            ? errors[0].detail
            : 'Unknown server error';
        this.setState({ error: new Error(reason) });
      } else if (post) {
        post(data);
        return this.flattenData(data);
      } else {
        // TODO local cache
        const docs = this.flattenData(data);
        this.setState({ docs });
        return docs;
      }
    } catch (error) {
      this.popLoading();
      this.setState({ error });
    }
    return [];
  }
}

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
        allDocs: this.listDocuments.bind(this)
      }
    );
  }

  async createDocument(doc: object): Promise<RevObject[]> {
    const { docType } = this;
    const payload = [
      {
        type: docType,
        attributes: doc
      }
    ];
    const path = `${dataAPI}/${docType}/create`;
    return this.exec(
      client => client.fetchJSON('POST', path, { data: payload }),
      () => this.listDocuments()
    );
  }

  async listDocuments(): Promise<RevObject[]> {
    return this.exec((client, docType) =>
      client.fetchJSON('GET', `${dataAPI}/${docType}/all`)
    );
  }
}

class References extends CRUD<ReferenceProps> {
  constructor(props: ReferenceProps) {
    super(props);

    if (!props.client) {
      throw new Error('Data Component: no client in props');
    }

    this.client = props.client as Client;
    this.docType = props.docType;
    this.setState({
      isLoading: false
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
        getLinkedDocs: this.getLinkedDocuments.bind(this)
      }
    );
  }

  async linkDocuments(targets: DocRep[]): Promise<RevObject[]> {
    const { type, id } = this.props.object;
    if (!targets || targets.length === 0) {
      // this.setState({ error: Error('linkDocuments: bad input') });
      return [];
    }

    return this.exec(
      (client, docType) => {
        const data = targets.map(x => ({
          id: x,
          type: docType
        }));
        const path = `${refAPI}/${type}/${id}`;
        return client.fetchJSON('POST', path, { data });
      },
      () => this.getLinkedDocuments()
    );
  }

  async unlinkDocuments(targets: DocRep[]): Promise<RevObject[]> {
    if (!targets || targets.length === 0) {
      // this.setState({ error: Error('unlinkDocuments: bad input') });
      return [];
    }

    return this.exec(
      (client, docType) => {
        const { type, id } = this.props.object;
        const path = `${refAPI}/${type}/${id}`;
        const all = targets.map(x =>
          client.fetchJSON('DELETE', path, {
            data: [
              {
                id: x,
                type: docType
              }
            ]
          })
        );
        return _.merge(Promise.all(all));
      },
      () => this.getLinkedDocuments()
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

export { Data, References };
