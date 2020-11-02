import json
import pathlib
import glob
import uuid
import jinja2
import collections
import requests


PATH = pathlib.Path(__file__).resolve().parents[0]
ruid = lambda: str( uuid.uuid4() ).split('-')[0]


import os, shutil
from bs4 import BeautifulSoup


def delete_file(path, filename):
    file_path = os.path.join(path, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (file_path, e))


def load_config( path ):
    with open(f"config/{ path }.json", "r") as f:
        CONFIG = json.load(f)
    return CONFIG


def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)



def MakeVue(name, path):
    with open(path, 'r') as file:
        html_doc = file.read()

    soup     = BeautifulSoup(html_doc, 'html.parser')
    template = rreplace(str( soup.template ).replace('<template>', '', 1), '</template>', '', 1).strip()
    script   = rreplace(str( soup.script ).replace('<script>', '', 1), '</script>', '', 1).strip().replace('export default', '', 1).strip()
    style    = rreplace(str( soup.style ).replace('<style>', '', 1), '</style>', '', 1).strip()
    if script == 'None': script = "{}"

    return f"""
Component('{ name }', { script },
{{
template: `{ template }`
}})
    """.strip()




def VueComponents( path, uid, templates ):

    components = "\n\n".join([ MakeVue(k, f"components/{ v }") for k,v in templates.items() ])
    AblazeVue  = f"""
const AblazeVue = {{}}
AblazeVue.install = function ( Vue ) {{
const Component = function ( name, scripts, template ) {{
    return Vue.component(name, {{...scripts, ...template}});
}}
{ components }
}}
    """.strip()

    return AblazeVue




def VuePages( path, uid, pages ):
    vue_pages  = []
    vue_routes = []
    for p in pages:
        #print( p['url'] )
        name     = p['path'].replace('.html', '')
        varname  = f"Page{ name.replace('/',' ').title().replace(' ','') }"
        vuepage  = f"""{{ path: '{ p['url'] }', name: '{ name }', component: { varname } }},"""

        vue_routes.append( vuepage )

        with open(f"templates/{ p['path'] }", 'r') as file:
            html_doc = file.read()

        soup     = BeautifulSoup(html_doc, 'html.parser')
        template = rreplace(str( soup.template ).replace('<template>', '', 1), '</template>', '', 1).strip()
        script   = rreplace(str( soup.script ).replace('<script>', '', 1), '</script>', '', 1).strip().replace('export default', '', 1).strip()
        if script == 'None': script = "{}"

        my_string =  f"""
const { varname } = VuePage({ script },
{{
template: `{ template }`
}})
        """.strip()
        vue_pages.append( my_string )

    vue_routes = "\n\t".join( vue_routes )
    vue_routes = f"""
const routes = [
\t{ vue_routes }
]
""".strip()
    vue_pages = "\n\n".join( vue_pages )
    vue_pages = f"""
const VuePage = function ( scripts, template ) {{
    return {{...scripts, ...template}}
}}
{ vue_pages }
"""
    return vue_routes, vue_pages






class VueTemplates:
    """docstring for VueTemplates."""
    def __init__(self, path=None):
        templateLoader   = jinja2.FileSystemLoader(searchpath=f'{ path }')
        self.templateEnv = jinja2.Environment(loader=templateLoader, trim_blocks=True,
            block_start_string='@@', block_end_string='@@',
            variable_start_string='@=', variable_end_string='=@'
        )
        self.components  = None
        self.pages       = None
        self.routes      = None

    def template( self, path ):
        return self.templateEnv.get_template( path )

    def set_components( self, project, uid, components ):
        self.components = VueComponents(project, uid, components)

    def set_pages( self, project, uid, components ):
        self.routes, self.pages = VuePages(project, uid, components)


    def set_vue( self, project=None, uid=None, components=None, pages=None ):
        self.set_components(project, uid, components)
        self.set_pages(project, uid, pages)
        _components = self.minify( self.components )
        _pages      = self.minify( self.pages )
        _routes     = self.routes


        JS_CODE     = "\n".join([ _components, _pages ])
        STATIC      = str( project / 'static' / 'build' )
        PROJECT     = str( project / 'static' / 'build' / f'app-{ uid }.js' )
        ROUTES      = str( project / 'static' / 'build' / f'routes-{ uid }.js' )

        if not os.path.exists( STATIC ): os.makedirs( STATIC )

        for filename in os.listdir( STATIC ):
            delete_file(STATIC, filename)

        with open(PROJECT, 'w') as file:
            file.write( JS_CODE )

        with open(ROUTES, 'w') as file:
            file.write( _routes )


    @staticmethod
    def minify( text ):
        url      = 'https://javascript-minifier.com/raw'
        data     = { 'input': text }
        return requests.post(url, data=data).text