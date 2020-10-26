import basics

import users

Models      = basics.schemas.group( users.schema )
Blueprints  = basics.blueprints.crud_group( users.blueprint )
#Database    = basics.sanic.Postgres(user = 'username', password = 'password', database = 'mewb', host = '127.0.0.1', port = 5432)
Database    = basics.sanic.Sqlite('database_test.db')


from sanic import Sanic
from sanic import response

app = Sanic("hello_example")


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
