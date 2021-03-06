import json, pathlib
import uuid


from basics.blueprints import Vue

PROJECT = pathlib.Path(__file__).resolve().parents[2]
PATH    = pathlib.Path(__file__).resolve().parents[0]


UID         = str( uuid.uuid4() ).split('-')[0]
vue         = Vue( file_path = PATH, project_path = PROJECT, uid = UID )
CONFIG      = vue.load_config('app')
VUEX        = vue.load_config('vuex')
COMPONENTS  = vue.load_config('components')
PAGES       = vue.load_config('pages')
DEBUG       = CONFIG['debug']


TEMPLATE_SETUP = {
    "static"    : "static",
    "debug"     : DEBUG,
    "vuex"      : json.dumps( VUEX ),
    "app"       : f"app-{ UID }.js",
    "routes"    : f"routes-{ UID }.js",
    "setup"     : f"setup-{ UID }.js",
}



from sanic import Sanic, response


app = Sanic('frontend')
app.static('/static', str(PROJECT / 'static'))


with open('index.html', 'r') as file:
    HTML_INDEX = file.read()


@app.route("/")
@app.route("/<path:path>")
async def app_root(request, path=None):
    UID         = str( uuid.uuid4() ).split('-')[0]
    vue         = Vue( file_path = PATH, project_path = PROJECT, uid = UID )
    CONFIG      = vue.load_config('app')
    VUEX        = vue.load_config('vuex')
    COMPONENTS  = vue.load_config('components')
    PAGES       = vue.load_config('pages')
    DEBUG       = CONFIG['debug']

    if DEBUG:
        TEMPLATE_SETUP = {
            "static"    : "static",
            "debug"     : DEBUG,
            "vuex"      : json.dumps( VUEX ),
            "app"       : f"app-{ UID }.js",
            "routes"    : f"routes-{ UID }.js",
            "setup"     : f"setup-{ UID }.js",
        }
        vue.set_vue(components=COMPONENTS, pages=PAGES)
        template   = vue.template( "app/__init__.html" )
        BASE_HTML  = template.render( **TEMPLATE_SETUP )
        html_index = vue.set_setup( code=BASE_HTML )
        return response.html( html_index )
    else:
        return response.html( HTML_INDEX )



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
