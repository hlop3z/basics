from basics import blueprints

name = 'users'
blueprint = blueprints.Blueprint( name )

@blueprint.route
async def create(model, payload):
    db = await model[ name ].create( payload )
    return db


@blueprint.route
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
