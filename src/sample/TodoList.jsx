import React, { useState, useContext, useEffect } from 'react';
import {
  List, Button, Input, Checkbox,
} from 'antd';

import { GQLQueryContext } from 'gqlquery';
import {
  createTest,
  allTest,
  deleteTest,
  getTest,
  putTest,
  findTest,
  allLinksTest,
  linkTest,
  unlinkTest,
} from './gql';

let gQuery = null;

const mapDocs = (docs) => {
  const fn = item => item.id != null;
  return docs.items.filter(fn).map(item => ({ id: item.id, ...item.attributes }));
};

const all = async () => {
  const { docs } = await gQuery(allTest);
  return mapDocs(docs);
};
const create = async (form, setDocs) => {
  await gQuery(createTest, { data: form });
  const docs = await all();
  setDocs(docs);
};
const del = async (id, setDocs) => {
  await gQuery(deleteTest, { id });
  const docs = await all();
  setDocs(docs);
};
const updateDone = async (id, done, setDocs) => {
  const { doc } = await gQuery(getTest, { id });
  await gQuery(putTest, {
    data: {
      title: doc.attributes.title,
      description: doc.attributes.description,
      done,
    },
    id,
  });
  const docs = await all();
  setDocs(docs);
};
const find = async (setDocs) => {
  const { docs } = await gQuery(findTest, {
    index: 'title',
    selector: '{ "done": { "$eq": true } }',
  });
  setDocs(mapDocs(docs));
};
const allLinks = async (id) => {
  const { docs } = await gQuery(allLinksTest, { id });
  return mapDocs(docs);
};
const initFileIdAndLinks = async (setLinks, setFileId, setDocs) => {
  const id = 'b1da4c21123e4c3ab03b11e91008b4c3';
  const links = await allLinks(id);
  const docs = await all();
  setFileId(id);
  setLinks(links);
  setDocs(docs);
};
const link = async (fileId, testId, setLinks) => {
  await gQuery(linkTest, { id: fileId, rids: [testId] });
  setLinks(await allLinks(fileId));
};
const unlink = async (fileId, testId, setLinks) => {
  await gQuery(unlinkTest, { id: fileId, rids: [testId] });
  setLinks(await allLinks(fileId));
};

const TodoList = () => {
  const [docs, setDocs] = useState([]);
  const [form, setform] = useState({
    title: '',
    description: '',
    done: false,
  });
  const [links, setLinks] = useState([]);
  const [fileId, setFileId] = useState(null);
  const { query } = useContext(GQLQueryContext);
  gQuery = async (source, variableValues, operationName) => {
    const ret = await query(source, variableValues, operationName);
    if (ret.errors) {
      throw ret.errors;
    }
    return ret.data;
  };
  useEffect(() => {
    initFileIdAndLinks(setLinks, setFileId, setDocs);
  }, []);
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <span>Title: </span>
        <Input
          onChange={(v) => {
            setform({ ...form, title: v.target.value });
          }}
          value={form.title}
        />
        <span>Description: </span>
        <Input
          onChange={(v) => {
            setform({ ...form, description: v.target.value });
          }}
          value={form.description}
        />
        <span>Done: </span>
        <Checkbox
          checked={form.done}
          onChange={(v) => {
            setform({ ...form, done: v.target.checked });
          }}
        />
        <Button onClick={() => create(form, setDocs)}>添加</Button>
      </div>
      <div>
        <Button onClick={() => find(setDocs)}>搜索已完成</Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={docs}
        renderItem={(item) => {
          const isInLinked = links.find(l => l.id === item.id) != null;
          const linkOp = isInLinked ? unlink : link;
          return (
            <List.Item
              actions={[
                <Button onClick={() => del(item.id, setDocs)}>删除</Button>,
                <Button onClick={() => updateDone(item.id, !item.done, setDocs)}>
                  {item.done ? '取消' : '完成'}
                </Button>,
                fileId && (
                  <Button onClick={() => linkOp(fileId, item.id, setLinks)}>
                    {isInLinked ? '取消连接' : '添加连接'}
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default TodoList;
