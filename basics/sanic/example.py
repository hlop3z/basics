from . import register_plugin

#@register_plugin
class Plugin:
    def hello(self):
        print("Hello from < Class >")


#@register_plugin
def hello():
    print("Hello from < Function >")

import functools

def postgres_handler():
    def decorator( function ):
        @functools.wraps( function )
        async def decorated_function(request, *args, **kwargs):
            return await function(request, *args, **kwargs)
        return decorated_function
    return decorator
