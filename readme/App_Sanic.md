# README(s) -> **Files**
* CRUD_Blueprint
* CRUD_Models

# App - Example
```
import basics

import users

Models      = basics.schemas.group( users.schema )
Blueprints  = basics.blueprints.crud_group( users.blueprint )
Database    = basics.sanic.Sqlite('test.db')
#Database    = basics.sanic.Postgres(user = 'username', password = 'password', database = 'mewb', host = '127.0.0.1', port = 5432)


from sanic import Sanic
from sanic import response

app = Sanic("api_db_sanic")

"""
from sanic_cors import CORS
CORS(app, automatic_options=True, supports_credentials=True)

from sanic_compress import Compress
Compress( app )
"""

api_handler = Database.handler( blueprints=Blueprints, models=Models )
app.register_listener(Database.setup, 'before_server_start')


@app.post("/")
async def root(request):
    payload = await api_handler(request.app, request.json)
    return response.json( payload )


@app.get("/info")
async def info(request):
    payload = {
    "models" : Models.keys(),
    "urls"   : Blueprints.keys(),
    "info"   : { k:v.form.meta._asdict() for k,v in Models.items() },
    }
    return response.json( payload )


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8085)
```
