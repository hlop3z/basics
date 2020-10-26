from . import register_plugin
from .blueprints import Blueprint

PLUGINS  = dict()

def Crud():
    bp = Blueprint( 'crud' )

    @bp.route
    async def create(name, models, payload):
        return await models[ name ].create( payload )


    @bp.route
    async def delete(name, models, payload):
        return await models[ name ].delete( payload )


    @bp.route
    async def update(name, models, payload):
        return await models[ name ].update( form=payload[ "form" ], query=payload[ "query" ] )


    @bp.route
    async def all(name, models, payload):
        if "fields" in payload  : fields = payload[ "fields" ]
        else                    : fields = [ "*" ]
        return await models[ name ].find(**{
            "query"     : None,
            "fields"    : fields,
            "sort_by"   : payload[ "sort" ],
            "page"      : {"page": payload[ "page" ], "size": payload[ "size" ] }
        })


    @bp.route
    async def find(name, models, payload):
        if "fields" in payload  : fields = payload[ "fields" ]
        else                    : fields = [ "*" ]
        return await models[ name ].find(**{
            "query"     : payload[ "query" ],
            "fields"    : fields,
            "sort_by"   : payload[ "sort" ],
            "page"      : {"page": payload[ "page" ], "size": payload[ "size" ] }
        })


    @bp.route
    async def get(name, models, payload):
        if "fields" in payload  : fields = payload[ "fields" ]
        else                    : fields = [ "*" ]
        return await models[ name ].get(**{
            "query"     : payload[ "query" ],
            "fields"    : payload[ "fields" ],
        })

    #Register Blueprint
    return bp


@register_plugin
def crud_group(*plugins, prefix=None):
    for p in plugins:
        if prefix:
            for key,value in p.PLUGINS.items(): PLUGINS[ f'{ prefix }/{ key }' ] = value
        else:
            PLUGINS.update( p.PLUGINS )
        p.PLUGINS.clear()
    PLUGINS.update( Crud().PLUGINS )
    return PLUGINS
