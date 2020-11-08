import json, pathlib
import uuid


from basics.blueprints import Vue

PROJECT = pathlib.Path(__file__).resolve().parents[2]
PATH    = pathlib.Path(__file__).resolve().parents[0]


from quart import Quart, request, send_file, render_template


app = Quart('frontend')


@app.route("/")
@app.route("/<path:path>")
async def app_root(path=None):
    UID         = str( uuid.uuid4() ).split('-')[0]
    vue         = Vue( file_path = PATH, project_path = PROJECT, uid = UID )
    CONFIG      = vue.load_config('app')
    VUEX        = vue.load_config('vuex')
    COMPONENTS  = vue.load_config('components')
    PAGES       = vue.load_config('pages')
    DEBUG       = CONFIG['debug']

    if DEBUG:
        TEMPLATE_SETUP = {
            "static"    : "__static__",
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
        return html_index.encode('utf-8')
    else:
        return await send_file( 'index.html' )



@app.route("/__static__/<path:path>")
async def app_send_from_file( path ):
    STATIC  = str( PROJECT / 'static' / path )
    data    = await send_file( STATIC )
    return data



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
