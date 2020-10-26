# Field ( Options )
* auto     = Use ( Function ) instead of ( Value )
* required = True
* fixed    = False
* rules    = []
* regex    = []
* filters  = []
* choices  = []
* method   = lambda x : str( x )[:2]

# CRUD Blueprint -> (  \_\_init\_\_.py )
```
from .Schema import schema
from .Blueprint import blueprint
```

# CRUD Blueprint - Example
```
from basics import blueprints

name = 'users'
blueprint = blueprints.Blueprint( name )
RESPONSE  = blueprints.response( name )


@blueprint.route
async def custom(model, payload):
    form = model[ 'users' ].model.form
    #form.create({})
    #form.update({})
    return RESPONSE(False, payload, 'custom-method')


@blueprint.route
async def list(model, payload):
    db = await model[ 'users' ].find(
        query     = { "name" : { "like" : payload['search'] } },
        fields    = ['*'],
        sort_by   = '-id',
        page      = { "page": payload['page'], "size": payload['size'] }
    )
    return RESPONSE(False, db.data, 'custom-list')
```
