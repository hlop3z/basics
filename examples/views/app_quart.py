from quart import Quart, request, send_file
import jinja2, json, pathlib



PROJECT = pathlib.Path(__file__).resolve().parents[2]
PATH    = pathlib.Path(__file__).resolve().parents[0]

app = Quart('frontend_quart')


VUEX_SETUP = {
    "globals"       : { "project": 'ablaze' },
    "components"    : [  ],
    "views"         : [  ],
    "roles"         : [  ],
    "testwindow"    : 0,
    "screen"        : {'width':0, 'height':0},
    "forms"         : {
        "users":{ "name": None }
    },
    "api"           : {
        "core": 'http://0.0.0.0:8085'
    },
}

TEMPLATE_SETUP = {
    "base"   : "base_sanic.html",
    "static" : "__static__",
    "vuex"   : json.dumps( VUEX_SETUP ),
}


@app.route("/")
async def app_root():
    templateLoader = jinja2.FileSystemLoader(searchpath=f'{ PATH }')
    templateEnv = jinja2.Environment(loader=templateLoader, trim_blocks=True,
        block_start_string='@@', block_end_string='@@',
        variable_start_string='@=', variable_end_string='=@'
    )
    template_file = "templates/index.html"
    template  = templateEnv.get_template( template_file )
    BASE_HTML = template.render( **TEMPLATE_SETUP )
    return BASE_HTML



@app.route("/__static__/<path:path>")
async def app_send_from_file( path ):
    STATIC  = str( PROJECT / 'static' / path )
    data    = await send_file( STATIC )
    return data



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)
