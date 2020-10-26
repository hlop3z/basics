from . import register_plugin

from collections import namedtuple

PLUGINS  = dict()
RESPONSE = namedtuple('Blueprints', ['error', 'data', 'method'])

@register_plugin
def group(*plugins, prefix=None):
    for p in plugins:
        if prefix:
            for key,value in p.PLUGINS.items(): PLUGINS[ f'{ prefix }/{ key }' ] = value
        else:
            PLUGINS.update( p.PLUGINS )
        p.PLUGINS.clear()
    return PLUGINS


@register_plugin
class Blueprint:
    def __init__(self, name=None):
        self.name    = name
        self.PLUGINS = dict()

    @property
    def method(self): return self.PLUGINS

    def route(cls, function):
        # Set-Name
        bp_name = f'''{ cls.name.lower() }'''
        name    = function.__name__
        url     = f'''{ bp_name }/{ name }'''
        if not url in cls.PLUGINS   : cls.PLUGINS[ url ] = function
        else                        : raise Exception(f'''Function: < { name } > inside Blueprints: < { bp_name } > is Already Registered!''')
