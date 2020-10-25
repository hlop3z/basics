# MODULES
from . import schemas
from . import __demo__
from . import blueprints



# STRUCTURE
__plugins__ = {
"schemas" : schemas.__dir__(),
"__demo__" : __demo__.__dir__(),
"blueprints" : blueprints.__dir__(),
}