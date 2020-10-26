from collections import namedtuple

from . import register_plugin
from .schemas import Schema
from .sqlow import Sqlow

PLUGINS  = dict()
RESPONSE = namedtuple('Model', ['error', 'data', 'method'])

@register_plugin
def group(*plugins, prefix=None):
    for p in plugins:
        if not p.name in PLUGINS: PLUGINS[ p.name ] = p
        else                    : raise Exception(f'''Model: < { p.name } > is Already Registered!''')
    return PLUGINS


class Model:
    def __init__(self, name=None, schema=None, sqlite=False):
        self.name      = name
        self.form      = Schema( **schema )
        self.sql       = Sqlow( name, sqlite = sqlite )
        self.tx        = None

    def create( self, form=None ):
        create = self.form.create( form )
        if not create.error: return RESPONSE(False, self.sql.create( create.data ), 'sql-insert')
        return create

    def update( self, form=None, query=None ):
        update = self.form.update( form )
        if not update.error: return RESPONSE(False, self.sql.update( update.data, query ), 'sql-update')
        return update

    def find( self, query={}, fields=['*'], sort_by=None, page=None ):
        return RESPONSE(False, self.sql.find( query, fields, sort_by, page ), 'sql-where')

    def delete( self, query=None ):
        return RESPONSE(False, self.sql.delete( query ), 'sql-delete')




@register_plugin
def Postgres(name=None, schema=None): return Model(name=name, schema=schema, sqlite=False)

@register_plugin
def Sqlite(name=None, schema=None)  : return Model(name=name, schema=schema, sqlite=True)
