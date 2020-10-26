from sanic import Sanic
from sanic import response
import jinja2, json, pathlib

PROJECT = pathlib.Path(__file__).resolve().parents[2]

app = Sanic('frontend')

app.static('/static', str(PROJECT / 'static'))


def template(view):
    TEMPLATE_FILE  = f"templates/{ view }.html"
    templateLoader = jinja2.FileSystemLoader(searchpath="./")
    templateEnv    = jinja2.Environment(loader=templateLoader, trim_blocks=True,
                    block_start_string='@@', block_end_string='@@',
                    variable_start_string='@=', variable_end_string='=@'
                    )
    template = templateEnv.get_template(TEMPLATE_FILE)
    return template.render(data=json.dumps( {
        "globals"       : [],
        "components"    : [],
        "forms"         : [],
        "views"         : [],
        "roles"         : [],
        "screen"        : {'width':0, 'height':0},
    } ))


@app.route('/')
@app.route('/<path:path>')
async def app_root(request, path=''):
    view     = template('index')
    payload  = response.html( view )
    print( path )
    return payload

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8085)
