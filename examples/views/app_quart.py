import json, pathlib
import uuid
import glob

ruid = lambda: str( uuid.uuid4() ).split('-')[0]

from Vue import VueTemplates, load_config

PROJECT = pathlib.Path(__file__).resolve().parents[2]
PATH    = pathlib.Path(__file__).resolve().parents[0]


UID         = ruid()
CONFIG      = load_config('app')
DEBUG       = CONFIG['debug']
VUEX        = load_config('vuex')
COMPONENTS  = load_config('components')
PAGES       = load_config('pages')


TEMPLATE_SETUP = {
    "static"    : "__static__",
    "debug"     : DEBUG,
    "vuex"      : json.dumps( VUEX ),
    "app"       : f"app-{ UID }.js",
    "routes"    : f"routes-{ UID }.js",
}


from quart import Quart, request, send_file


app = Quart('frontend_quart')
vue = VueTemplates( PATH )



if DEBUG:
    @app.route("/")
    @app.route("/<path:path>")
    async def app_root(path=None):
        vue.set_vue(project=PROJECT, uid=UID, components=COMPONENTS, pages=PAGES)
        template  = vue.template( "templates/__init__.html" )
        BASE_HTML = template.render( **TEMPLATE_SETUP )
        with open('index.html', 'w') as file:
            file.write( BASE_HTML )    
        return BASE_HTML
else:
    @app.route("/")
    @app.route("/<path:path>")
    async def app_root(path=None):
        template  = vue.template( "index.html" )
        BASE_HTML = template.render( **TEMPLATE_SETUP )
        return BASE_HTML



@app.route("/__static__/<path:path>")
async def app_send_from_file( path ):
    STATIC  = str( PROJECT / 'static' / path )
    data    = await send_file( STATIC )
    return data


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
