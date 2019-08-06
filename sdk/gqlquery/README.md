```
query view1 {
  TEST_view(view: "view1", keys: ["title"], limit: 5) {
    items {
      ... on TEST_view1 {
        title
        done
      }
    }
    next
  }
}

query find {
  TEST_find(index: "title", selector: "{\"done\": { \"$eq\": true } }") {
    items {
      id
      rev
      attributes {
        title
        done
        description
      }
    }
    next
    offset
    total
  }
}

query all {
  TEST_all(limit: 10) {
    items {
      id
      rev
      attributes {
        title
        done
        description
      }
    }
    next
    offset
    total
  }
}

query all2 {
  TEST_all(limit: 100) {
    items {
      id
    }
  }
}

query allLinks {
  TEST_allLinks(id: "b1da4c21123e4c3ab03b11e91008b4c3", doctype: "keyayun.seal.files", limit: 100) {
    items {
      id
      rev
      attributes {
        title
        done
      }
    }
    next
    total
  }
}

query nextLink {
  TEST_nextLinkPage(pageUrl: "/v1/references/keyayun.seal.files/b1da4c21123e4c3ab03b11e91008b4c3?page%5Bviewrequest%5D=%7B%22start_key%22%3A%5B%22b1da4c21123e4c3ab03b11e91008b4c3%22%2C%22keyayun.service.test%22%2C%222019-07-27T06%3A55%3A53.60951414Z%22%5D%2C%22end_key%22%3A%5B%22b1da4c21123e4c3ab03b11e91008b4c3%22%2C%22keyayun.service.test%22%2C%22%F4%8F%BF%BF%22%5D%2C%22limit%22%3A1%7D") {
    items {
      id
      rev
      attributes {
        title
        done
      }
    }
    next
    total
  }
}

mutation link {
  TEST_link(doctype: "keyayun.seal.files", id: "b1da4c21123e4c3ab03b11e91008b4c3", rids: ["b1db4c21123e4c3ab03b11e953755411", "b1dc4c21123e4c3ab03b11e953eb425e", "b1dc4c21123e4c3ab03b11e954ed743f"])
}

mutation unlink {
  TEST_unlink(doctype: "keyayun.seal.files", id: "b1da4c21123e4c3ab03b11e91008b4c3", rids: ["b1db4c21123e4c3ab03b11e953755411"])
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

# mutation create($data: TEST_IData) {
#   doc: TEST_create(data: $data) {
#     id
#     rev
#   }
# }

query aa {
  TEST_get(id: "bc694c21123e4c3aaeb0111e964d91c7b") {
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

```

mutation nc($ninput: NOTIF_IData!) {
  NOTIF_create(data: $ninput) {
    id
    attributes {
      type
      title
    }
  }
}

mutation tc {
  TEST_create(data: { title: "a", description: "b", done: false }) {
    id
    attributes {
      title
    }
  }
}

query view1 {
  TEST_view(view: "view1", keys: ["title"], limit: 5) {
    items {
      ... on TEST_view1 {
        title
        done
      }
    }
    next
  }
}

query allnv {
  NOTIF_all(limit: 20) {
    items {
      attributes {
        type
        fromApp
        message
        read
        link
        title
      }
    }
  }
}

query nv {
  NOTIF_view(view: "uniquebyapp", keys: ["key"], limit: 20) {
    items {
      ... on NOTIF_uniquebyapp {
        app
      }
    }
  }
}

```
