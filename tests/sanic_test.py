import sys

sys.path.append('../')

import basics


from Users import Users
from users import users
from Wallets import Wallets
from wallets import wallets

Models      = basics.schemas.group( Users, Wallets )
Blueprints  = basics.blueprints.group( users, wallets )
Postgres    = basics.schemas.Postgres(user = 'username', password = 'password', database = 'mewb', host = '127.0.0.1', port = 5432)

print( Models.keys() )
print( Blueprints.keys() )

from sanic import Sanic
from sanic import response

app = Sanic("hello_example")





@app.post("/")
async def root(request):
    bp_methods = Blueprints
    # Client's JSON
    payload = request.json
    # Handler
    async def Handler(models, payload): return await bp_methods[ payload['url'] ]( models, payload['data'] )
    # Real Handler
    answer  = await request.app.postgres( Handler, payload = payload, models = Models )()
    if not answer.error:
        return response.json( answer.data._asdict() )
    else:
        print( answer.data )
        return response.json({ "error": answer.error, "data": None, "method": answer.method })



app.register_listener(Postgres.setup, 'before_server_start')


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8085)
