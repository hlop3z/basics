import functools
import collections
import asyncpg

RESPONSE = collections.namedtuple('Postgres', ['error', 'data', 'method'])

from . import register_plugin

class PostgresHandler:
    def __init__(self, Blueprints=None, Models=None):
        async def handler(app, payload):
            # Handler
            if 'model' in payload:
                async def Handler(models): return await Blueprints[ payload['url'] ]( payload['model'], models, payload['data'] )
            else:
                async def Handler(models): return await Blueprints[ payload['url'] ]( models, payload['data'] )
            # Real Handler
            answer  = await app.postgres( Handler, models = Models )()
            if not answer.error : output = answer.data._asdict()
            else                : output = answer._asdict()
            return output

        self.handler = handler



@register_plugin
class Postgres:
    def __init__(self, user=None, password=None, database=None, host=None, port=None):
        self.user      = user
        self.password  = password
        self.database  = database
        self.host      = host
        self.port      = port

    async def setup(self, app, loop):
        pool = await asyncpg.create_pool(
            user      = self.user,
            password  = self.password,
            database  = self.database,
            host      = self.host,
            port      = self.port
        )

        def postgres_tx( function, models=None ):
            @functools.wraps( function )
            async def wrapper_decorator(*args, **kwargs):
                async with pool.acquire() as connection:
                    async with connection.transaction():
                        try:
                            # Create a nested transaction:
                            async with connection.transaction():

                                # Postgres Models
                                class PostgresModel:
                                    def __init__(self, tx=None, model=None):
                                        self.tx        = tx
                                        self.model     = model

                                    async def create( self, form=None ):
                                        sql = self.model.create( form = form )
                                        if not sql.error: return RESPONSE(False, dict( await self.tx.fetchrow( *sql.data ) ), 'model-create')
                                        return sql

                                    async def update( self, form=None, query=None ):
                                        sql = self.model.update(form = form, query = query)
                                        if not sql.error: return RESPONSE(False, [ dict(r) for r in await self.tx.fetch( *sql.data ) ], 'model-update')
                                        return sql

                                    async def get( self, query={}, fields=['*'] ):
                                        sql = self.model.find(query = query, fields = fields, sort_by = None, page = None)
                                        data = await self.tx.fetchrow( *sql.data )
                                        if not sql.error: return RESPONSE(False, dict( data ) if data else {}, 'model-get')
                                        return sql

                                    async def find( self, query={}, fields=['*'], sort_by=None, page=None ):
                                        sql = self.model.find(query = query, fields = fields, sort_by = sort_by, page = page)
                                        if not sql.error: return RESPONSE(False, [ dict(r) for r in  await self.tx.fetch( *sql.data ) ], 'model-find')
                                        return sql

                                    async def delete( self, query=None ):
                                        sql = self.model.delete( query = query )
                                        if not sql.error: return RESPONSE(False, [ dict(r) for r in await self.tx.fetch( *sql.data ) ], 'model-delete')
                                        return sql


                                # Register Models to Transaction
                                if models:
                                    MODELS = { k: PostgresModel(connection, model) for k, model in models.items() }
                                    response = await function(MODELS, *args, **kwargs)
                                else:
                                    response = await function(connection, *args, **kwargs)
                                return RESPONSE(False, response, 'postgres-transaction')

                        # AsyncPG Ignore exception
                        except Exception as e:
                            return RESPONSE(True, e.args[0], 'postgres-transaction')
            return wrapper_decorator


        # Register - Postgres Transaction's Wrapper
        app.postgres = postgres_tx


    def handler(self, blueprints=None, models=None):
        return PostgresHandler(Blueprints=blueprints, Models=models).handler
