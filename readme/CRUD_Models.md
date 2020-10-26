# Field ( Options )
* auto     = Use ( Function ) instead of ( Value )
* required = True
* fixed    = False
* rules    = []
* regex    = []
* filters  = []
* choices  = []
* method   = lambda x : str( x )[:2]


# Model - Example
```
#Postgres or Sqlite
from basics.schemas import Sqlite as Model
from basics.schemas import Field, easy_regex

import hashlib, time

def hash_password(value): return hashlib.blake2s( value.encode('utf-8'), digest_size=8 ).hexdigest()

_isPass     = lambda v: """^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\\?\/\|!@#\$%\^&\*><,\."'])(?=.{"""+str(v)+""",})"""
isPass      = _isPass(8) # AT LEAST ONE OF EACH (a-z, A-Z, 0-9) and AT LEAST ONE OF ( . , \ / < > ? ! @ # $ % ^ & * | )
isUsername  = easy_regex('a-z0-9_', 2)
isPhone     = '^\+?(\d.*){6,}$'

User = Model(
    name   = "user",
    schema = {
        "group"     : Field( None, choices=['customers', 'admins', 'employees', 'partners', 'investors'] ),
        "username"  : Field( regex=[ isUsername ], validators=[ (lambda v: "__" not in v) ]  ),
        "password"  : Field( method=hash_password,  regex=[ isPass ]  ),
        "phone"     : Field( regex=[ isPhone ], rules=[ (lambda v: "--" not in v) ], required=False  ),
        "modified"  : Field( lambda: int( time.time() ) ),
        "timestamp" : Field( lambda: int( time.time() ), fixed=True ),
})
```
