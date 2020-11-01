import json
import pathlib
import glob
import uuid
import jinja2
import collections

PATH = pathlib.Path(__file__).resolve().parents[0]
ruid = lambda: str( uuid.uuid4() ).split('-')[0]


import os, shutil
from bs4 import BeautifulSoup


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

    return f"""
Component('{ name }', { script },
{{
template: `{ template }`
}})
    """.strip()


def VueComponents( path, uid, templates ):
    STATIC  = str( path / 'static' / 'tmp' )
    PROJECT = str( path / 'static' / 'tmp' / f'components-{ uid }.js' )

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

    if not os.path.exists( STATIC ):
        os.makedirs( STATIC )

    for filename in os.listdir( STATIC ):
        file_path = os.path.join(STATIC, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


    with open(PROJECT, 'w') as file:
        file.write( AblazeVue )




def load_config( path ):
    with open(f"config/{ path }.json", "r") as f:
        CONFIG = json.load(f)
    return CONFIG




class VueTemplates:
    """docstring for VueTemplates."""
    def __init__(self, debug=False, path=None):
        templateLoader   = jinja2.FileSystemLoader(searchpath=f'{ path }')
        self.templateEnv = jinja2.Environment(loader=templateLoader, trim_blocks=True,
            block_start_string='@@', block_end_string='@@',
            variable_start_string='@=', variable_end_string='=@'
        )

        templates   = glob.glob(f"{ path }/templates/*.html")
        files       = [ i.replace(f"{ path }/templates/", "") for i in templates ]
        names       = [ i.replace('.html', '') for i in files ]
        output      = collections.namedtuple('Templates', ['files', 'names'])

        self.debug = debug
        self.templates = output(files, names)

    def template( self, path ):
        return self.templateEnv.get_template( self.html_template( path ) )

    def set_components( self, project, uid, components ):
        if self.debug: VueComponents(project, uid, components)

    def html_template( self, page ):
        if not page                        : page = 'index'
        if page not in self.templates.names: page = '404'
        template = lambda t: f"templates/{ t }.html"
        return template( page )
