export const createTest = `
mutation create($data: TEST_IData!) {
  doc: TEST_create(data: $data) {
    id
    rev
    attributes {
      description
      title
      done
    }
  }
}
`;

export const allTest = `
query all {
  docs: TEST_all(limit: 100) {
    items {
      id
      attributes {
        description
        title
        done
      }
    }
  }
}
`;

export const deleteTest = `
mutation del($id: String!) {
  TEST_delete(id: $id, force: true)
}
`;

export const getTest = `
query get($id: String!) {
  doc: TEST_get(id: $id) {
    id
    attributes {
      description
      title
      done
    }
  }
}
`;

export const putTest = `
mutation put($data: TEST_IData!, $id: String!) {
  doc: TEST_put(data: $data, id: $id) {
    id
    rev
    attributes {
      description
      title
      done
    }
  }
}
`;

export const findTest = `
query find($index: String!, $selector: String!) {
  docs: TEST_find(index: $index, selector: $selector) {
    items {
      id
      attributes {
        title
        done
        description
      }
    }
  }
}
`;

export const allLinksTest = `
query allLinks($id: String!) {
  docs: TEST_allLinks(id: $id, doctype: "keyayun.seal.files", limit: 100) {
    items {
      id
      attributes {
        title
        done
        description
      }
    }
  }
}
`;

export const linkTest = `
mutation link($id: String!, $rids: [String]!) {
  TEST_link(doctype: "keyayun.seal.files", id: $id, rids: $rids)
}
`;

export const unlinkTest = `
mutation unlink($id: String!, $rids: [String]!) {
  TEST_unlink(doctype: "keyayun.seal.files", id: $id, rids: $rids)
}
`;
