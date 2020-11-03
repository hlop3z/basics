import json, pathlib
import uuid

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
    "static"    : "static",
    "debug"     : DEBUG,
    "vuex"      : json.dumps( VUEX ),
    "app"       : f"app-{ UID }.js",
    "routes"    : f"routes-{ UID }.js",
    "setup"     : f"setup-{ UID }.js",
}

vue = VueTemplates( file_path = PATH, project_path = PROJECT )

from sanic import Sanic
from sanic import response

app = Sanic('frontend')
app.static('/static', str(PROJECT / 'static'))


if DEBUG:
    @app.route("/")
    @app.route("/<path:path>")
    async def app_root(request, path=None):
        vue.set_vue(uid=UID, components=COMPONENTS, pages=PAGES)
        template   = vue.template( "app/__init__.html" )
        BASE_HTML  = template.render( **TEMPLATE_SETUP )
        html_index = vue.set_setup( uid=UID, code=BASE_HTML )
        return response.html( html_index )

else:
    with open('index.html', 'r') as file:
        HTML_INDEX = file.read()

    @app.route("/")
    @app.route("/<path:path>")
    async def app_root(request, path=None):
        return response.html( HTML_INDEX )


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
