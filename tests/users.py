import sys

sys.path.append('../')

from basics import blueprints

def Crud(name):
    bp = blueprints.Blueprint( name )

    @bp.route
    async def create(model, payload):
        return await model[ name ].create( payload )


    @bp.route
    async def all(model, payload):
        return await model[ name ].find(**{
            "query"     : None,
            "fields"    : ['*'],
            "sort_by"   : payload[ "sort" ],
            "page"      : {"page": payload[ "page" ], "size": payload[ "size" ] }
        })


    @bp.route
    async def find(model, payload):
        return await model[ name ].find(**{
            "query"     : payload[ "query" ],
            "fields"    : payload[ "fields" ],
            "sort_by"   : payload[ "sort" ],
            "page"      : {"page": payload[ "page" ], "size": payload[ "size" ] }
        })

    @bp.route
    async def get(model, payload):
        return await model[ name ].get(**{
            "query"     : payload[ "query" ],
            "fields"    : payload[ "fields" ],
        })

    #Register Blueprint
    return bp

users = Crud( 'users' )
