from . import register_plugin

@register_plugin
def info(models=None, blueprints=None):
    return {
    "models" : models.keys(),
    "urls"   : blueprints.keys(),
    "info"   : { k:v.form.meta._asdict() for k,v in models.items() },

    "crud"   : {
    #Create
    'create'   : """
{
'model' : name,
'url'   : 'crud/create',
'data'  : {
    'name': 'user-1',
    'dob' : 446968800
},
}
    """.strip(),

    #Read - One
    'get'      : """
{
'model' : name,
'url'   : 'crud/get',
'data'  : {
    'fields': ['id', 'name', 'dob'],
    'query' : { 'id' : { 'eq' : 2 } },
},
}
    """.strip(),

    #Read - Many
    'find'     : """
{
'model' : name,
'url'   : 'crud/find',
'data'  : {
    'page'  : 1,
    'size'  : 5,
    'sort'  : 'id',
    'fields': ['id', 'name', 'dob'],
    'query' : [{ 'id' : { 'eq' : 1 } }, 'or', { 'id' : { 'eq' : 2 } }],
},
}
    """.strip(),

    #Read - All
    'all'      : """
{
'model' : name,
'url'   : 'crud/all',
'data'  : {
    'fields': ['*'],
    'page'  : 1,
    'size'  : 2,
    'sort'  : '-id',
},
}
    """.strip(),

    #Update
    'update'   : """
{
'model' : name,
'url'   : 'crud/update',
'data'  : {
    'query' : { 'id' : { 'ge' : 2 } },
    'form': { 'name' : 'userUpdated-2' },
},
}
    """.strip(),

    #Delete
    'delete'   : """
{
'model' : name,
'url'   : 'crud/delete',
'data'  : { 'id' : { 'ge' : 27 } },
}        """.strip(),
}
    }
