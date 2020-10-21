# Cookie-Cutter Web-Framework
* Sanic
* Jinja2
* Axios
* Vue
* Vuex
* Vuetify

# Clone (Option: 1)
```
git clone https://github.com/hlop3z/basics
```

# New File (Option: 2)
```
nano project.py
```
# Code ( Copy )
```
import subprocess, argparse, json, pathlib, shutil, os

PATH = os.getcwd()
cmd  = lambda x: subprocess.run(x, check=True, shell=True)

def new_project(name):
    app_name = name.lower().replace('-','_').strip()
    cmd(f'git clone https://github.com/hlop3z/basics')

    EXAMPLE_FILE = f"""
import sys

sys.path.append('../{ app_name }')


import { app_name }

# Modules
print( { app_name }.__plugins__ )

# Class
{ app_name }.__demo__.Plugin().hello()

# Def
{ app_name }.__demo__.hello()
    """.strip()

    try:
        shutil.rmtree("basics/.git")
        shutil.rmtree("basics/tests")
        shutil.rmtree("basics/examples")
        shutil.rmtree("basics/dist")
        shutil.rmtree("basics/basics.egg-info")
        os.remove("basics/project.py")
    except Exception as e:
        pass


    os.mkdir('basics/examples')
    os.mkdir('basics/tests')

    with open("basics/examples/example.py", "w") as f:
        f.write( EXAMPLE_FILE )
        f.close()

    shutil.move("basics/basics", f"basics/{ app_name }")
    shutil.move("basics", app_name)



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('project', nargs=1, help='''Clone Github "hlop3z/basics" for a new project''')
    args = parser.parse_args()

    if args.project: new_project( args.project[0] )
    else: pass



if __name__ == '__main__':
    main()

```

# Run
```
python3.7 project.py myapp
```
