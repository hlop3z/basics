import functools
import collections
import sqlite3

RESPONSE = collections.namedtuple('Sqlite', ['error', 'data', 'method'])

from . import register_plugin

class SqliteHandler:
    def __init__(self, Blueprints=None, Models=None):
        async def handler(app, payload):
            # Handler
            if 'model' in payload:
                async def Handler(models): return await Blueprints[ payload['url'] ]( payload['model'], models, payload['data'] )
            else:
                async def Handler(models): return await Blueprints[ payload['url'] ]( models, payload['data'] )
            # Real Handler
            answer  = await app.sqlite( Handler, models = Models )()
            if not answer.error : output = answer.data._asdict()
            else                : output = answer._asdict()
            return output

        self.handler = handler



@register_plugin
class Sqlite:
    def __init__(self, database=None):
        self.database  = database

    async def setup(self, app, loop):
        def dict_factory(cursor, row):
            d = {}
            for idx, col in enumerate(cursor.description):
                d[col[0]] = row[idx]
            return d

        connection = sqlite3.connect( self.database )
        connection.row_factory = dict_factory

        def sqlite_tx( function, models=None ):
            @functools.wraps( function )
            async def wrapper_decorator(*args, **kwargs):
                try:
                    with connection:
                        cursor = connection.cursor()
                        # Sqlite Models
                        class SqliteModel:
                            def __init__(self, tx=None, model=None):
                                self.tx        = tx
                                self.model     = model

                            async def create( self, form=None):
                                sql = self.model.create( form = form )
                                if not sql.error:
                                    data = self.tx.execute( *sql.data ).lastrowid
                                    r1 = await self.get({ "id" : { "eq" : data } })
                                    return RESPONSE(False, r1.data, 'model-create')
                                return sql

                            async def update( self, form=None, query=None ):
                                sql = self.model.update(form = form, query = query)
                                if not sql.error:
                                    self.tx.execute( *sql.data )
                                    r1 = await self.find( query )
                                    return RESPONSE(False, r1.data, 'model-update')
                                return sql

                            async def get( self, query={}, fields=['*'] ):
                                sql = self.model.find(query = query, fields = fields, sort_by = None, page = None)
                                if not sql.error:
                                    self.tx.execute( *sql.data )
                                    data = self.tx.fetchone()
                                    return RESPONSE(False, data if data else {}, 'model-get')
                                return sql

                            async def find( self, query={}, fields=['*'], sort_by=None, page=None ):
                                sql = self.model.find(query = query, fields = fields, sort_by = sort_by, page = page)
                                if not sql.error:
                                    self.tx.execute( *sql.data )
                                    data = self.tx.fetchall()
                                    return RESPONSE(False, data, 'model-find')
                                return sql

                            async def delete( self, query=None ):
                                sql = self.model.delete( query = query )
                                if not sql.error:
                                    r1 = await self.find( query )
                                    self.tx.execute( *sql.data )
                                    return RESPONSE(False, r1.data, 'model-delete')
                                return sql


                        # Register Models to Transaction
                        if models:
                            MODELS = { k: SqliteModel(cursor, model) for k, model in models.items() }
                            response = await function(MODELS, *args, **kwargs)
                        else:
                            response = await function(cursor, *args, **kwargs)
                        return RESPONSE(False, response, 'sqlite-transaction')

                # Sqlite3 Ignore exception
                except Exception as e:
                    print( e )
                    return RESPONSE(True, e.args[0], 'sqlite-transaction')
            return wrapper_decorator


        # Register - Postgres Transaction's Wrapper
        app.sqlite = sqlite_tx


    def handler(self, blueprints=None, models=None):
        return SqliteHandler(Blueprints=blueprints, Models=models).handler
