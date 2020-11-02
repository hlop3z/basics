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
    "base"      : "base_sanic.html",
    "static"    : "__static__",
    "debug"     : DEBUG,
    "vuex"      : json.dumps( VUEX ),
    "components": f"components-{ UID }.js",
    "routes"    : f"routes-{ UID }.js",
    "pages"     : f"pages-{ UID }.js",
}



from quart import Quart, request, send_file
app = Quart('frontend_quart')


@app.route("/")
@app.route("/<path:path>")
async def app_root(path=None):
    vue = VueTemplates( DEBUG, PATH )
    vue.set_components(PROJECT, UID, COMPONENTS)
    vue.set_pages(PROJECT, UID, PAGES)

    if path:
        file = path.split('/')[0]
        args = path.split('/')[1:]
    else:
        file = None
        args = []
    template  = vue.template( "base_sanic.html" )
    BASE_HTML = template.render( **TEMPLATE_SETUP )
    return BASE_HTML


@app.route("/__static__/<path:path>")
async def app_send_from_file( path ):
    STATIC  = str( PROJECT / 'static' / path )
    data    = await send_file( STATIC )
    return data


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
