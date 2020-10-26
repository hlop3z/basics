# SQL - Operators
* Create
* Read - One
* Read - All
* Read - Find
* Update
* Delete




## Create
```
payload = {
  'model' : name,
  'url'   : 'crud/create',
  'data'  : {
    'key1': value1,
    'key2': value2
  },
}
answer = api.post( payload )
```

## Read - One
```
payload = {
  'model' : name,
  'url'   : 'crud/get',
  'data'  : {
    "fields": ['key1', 'key2'],
    "query" : { "key1" : { "eq" : value1 } },
  },
}
answer = api.post( payload )
```

## Read - All
```
payload = {
  'model' : name,
  'url'   : 'crud/all',
  'data'  : {
    "fields": ['*'],
    "page"  : 1,
    "size"  : 10,
    "sort"  : '-id',
  },
}
answer = api.post( payload )
```

## Read - Find
```
payload = {
  'model' : name,
  'url'   : 'crud/find',
  'data'  : {
    "fields": ['*'],
    "page"  : 1,
    "size"  : 5,
    "sort"  : 'id',
    "query" : [{ "id" : { "eq" : 1 } }, "or", { "id" : { "eq" : 2 } }],
  },
}
answer = api.post( payload )
```

## Update
```
payload = {
  'model' : name,
  'url'   : 'crud/update',
  'data'  : {
    "query" : { "key1" : { "ge" : value1 } },
    "form": { "key2" : value2 },
  },
}
answer = api.post( payload )
```

## Delete
```
payload = {
  'model' : name,
  'url'   : 'crud/delete',
  "data"  : { "key1" : { "ge" : value1 } },
}
answer = api.post( payload )
```
