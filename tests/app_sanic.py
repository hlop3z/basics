import sys

sys.path.append('../')

import basics

from schema  import Users
from handler import users


Models      = basics.schemas.group( Users )
Blueprints  = basics.blueprints.crud_group( users )
#Database    = basics.sanic.Postgres(user = 'username', password = 'password', database = 'mewb', host = '127.0.0.1', port = 5432)
Database    = basics.sanic.Sqlite('database_test.db')


from sanic import Sanic
from sanic import response

app = Sanic("hello_example")


api_info    = basics.blueprints.info( blueprints=Blueprints, models=Models )
api_handler = Database.handler( blueprints=Blueprints, models=Models )
app.register_listener(Database.setup, 'before_server_start')


@app.post("/")
async def root(request):
    payload = await api_handler(request.app, request.json)
    return response.json( payload )


@app.get("/info")
async def info(request):
    return response.json( api_info )


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8085)
