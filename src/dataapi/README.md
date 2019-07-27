```
query all {
  TEST_all(limit: 1, skip: 2) {
    items {
      id
      rev
      attributes {
        title
        done
      }
    }
    next
    offset
    total
  }
}

query allLinks {
  TEST_allLinks(id: "9e254c21123e4c3ab02411e9dd8ff7c6", doctype: "keyayun.seal.files") {
    next
  }
}

mutation link {
  TEST_link(doctype: "keyayun.seal.files", id: "9e254c21123e4c3ab02411e9dd8ff7c6", rid: "9e294c21123e4c3ab03011e9d4340fd5")
}

query next {
  TEST_nextPage(pageUrl: "/v1/data/keyayun.service.test/all?descending=false&page%5Blimit%5D=1&page%5Bskip%5D=2&sortby=creation") {
    items {
      id
      rev
      attributes {
        title
        done
      }
    }
    next
    offset
    total
  }
}

query a {
  TEST_type
}

mutation b {
  TEST_create(data: {description: "desc", done: false, title: "title"}) {
    id
    rev
  }
}

query aa {
  TEST_get(id: "bc694c21123e4c3aaeb011e964d91c7b") {
    id
    rev
    attributes {
      description
      done
    }
  }
}

mutation d {
  TEST_delete(id: "bc694c21123e4c3aaeb011e9a3c8afe1", force: true)
}

mutation e {
  TEST_put(id: "bc694c21123e4c3aaeb011e9e16af72b", data: {description: "deeee", title: "123"}) {
    attributes {
      description
      done
    }
  }
}
```
