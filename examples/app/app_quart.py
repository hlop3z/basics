import basics

import users

Models      = basics.schemas.group( users.schema )
Blueprints  = basics.blueprints.crud_group( users.blueprint )
#Database    = basics.sanic.Postgres(user = 'username', password = 'password', database = 'mewb', host = '127.0.0.1', port = 5432)
Database    = basics.sanic.Sqlite('database_test.db')


from quart import Quart, websocket, request

app = Quart('api_db_quart')

api_handler = Database.handler( blueprints=Blueprints, models=Models )

@app.before_serving
async def create_db_pool():
    await Database.setup(app, None)


@app.route('/', methods=['POST'])
async def app_root():
    payload = await api_handler(app, await request.get_json())
    return payload


@app.route("/info")
async def app_info():
    payload = {
    "models" : list( Models.keys() ),
    "urls"   : list( Blueprints.keys() ),
    "info"   : { k:v.form.meta._asdict() for k,v in Models.items() },
    }
    return payload


if __name__ == "__main__":
    app.run(host="localhost", port=8013)
