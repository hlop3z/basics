import sys

sys.path.append('../')

from basics import blueprints

name  = 'users'
users = blueprints.Blueprint( name )

@users.route
async def create(model, payload):
    db = await model[ name ].create( payload )
    return db


@users.route
async def list(model, payload):
    #await models['users'].find({ "id" : { "eq" : 1 } })
    page = payload[ "page" ]
    q    = payload[ "query" ]
    db = await model[ name ].find(**{
        "query"     : { "id" : { "!eq" : q['id'] } },
        "fields"    : ['id', 'name', 'dob'],
        "sort_by"   : '-id',
        "page"      : {"page": page, "size": 2}
    })
    return db
