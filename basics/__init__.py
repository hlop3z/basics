# MODULES
from . import schemas
from . import __demo__



# STRUCTURE
__plugins__ = {
"schemas" : schemas.__dir__(),
"__demo__" : __demo__.__dir__(),
}
