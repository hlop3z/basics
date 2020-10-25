import functools
import asyncpg
import collections

RESPONSE = collections.namedtuple('Postgres', ['error', 'data', 'method'])

from . import register_plugin

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

        def postgres_tx( function, payload={}, models=None ):
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
                                        if not sql.error: return RESPONSE(False, await self.tx.execute( *sql.data ), 'model-update')
                                        return sql

                                    async def get( self, query={}, fields=['*'] ):
                                        sql = self.model.find(query = query, fields = fields, sort_by = None, page = None)
                                        if not sql.error: return RESPONSE(False, dict( await self.tx.fetchrow( *sql.data ) ), 'model-get')
                                        return sql

                                    async def find( self, query={}, fields=['*'], sort_by=None, page=None ):
                                        sql = self.model.find(query = query, fields = fields, sort_by = sort_by, page = page)
                                        if not sql.error: return RESPONSE(False, [ dict(r) for r in await self.tx.fetch( *sql.data ) ], 'model-find')
                                        return sql


                                    async def delete( self, query=None ):
                                        sql = self.model.delete( query = query )
                                        if not sql.error: return RESPONSE(False, await self.tx.execute( *sql.data ), 'model-delete')
                                        return sql


                                # Register Models to Transaction
                                if models:
                                    MODELS = { k: PostgresModel(connection, model) for k, model in models.items() }
                                    response = await function(MODELS, payload, *args, **kwargs)
                                else:
                                    response = await function(connection, payload, *args, **kwargs)
                                return RESPONSE(False, response, 'postgres-transaction')

                        # AsyncPG Ignore exception
                        except Exception as e:
                            return RESPONSE(True, e, 'postgres-transaction')
            return wrapper_decorator


        # Register - Postgres Transaction's Wrapper
        app.postgres = postgres_tx
