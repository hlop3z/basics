from basics.schemas import Field, easy_regex
from basics.schemas import Sqlite as Model #Postgres or Sqlite


schema = Model(
    name   = "users",
    schema = {
        "name" : None,
        "dob"  : Field( rules=[ (lambda v: "x" not in str(v)) ], required=False  ),
})







import hashlib, time

def hash_password(value):
    return hashlib.blake2s( value.encode('utf-8'), digest_size=8 ).hexdigest()

_isPass     = lambda v: """^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\\?\/\|!@#\$%\^&\*><,\."'])(?=.{"""+str(v)+""",})"""
isPass      = _isPass(8) # AT LEAST ONE OF EACH (a-z, A-Z, 0-9) and AT LEAST ONE OF ( . , \ / < > ? ! @ # $ % ^ & * | )
isUsername  = easy_regex('a-z0-9_', 2)
isPhone     = '^\+?(\d.*){6,}$'



Users2 = Model(
    name   = "users",
    schema = {
        "id"        : Field( required=False  ),
        "group"     : Field( None, choices=['customers', 'admins', 'employees', 'partners', 'investors'] ),
        "username"  : Field( regex=[ isUsername ], validators=[ (lambda v: "__" not in v) ]  ),
        "password"  : Field( method=hash_password,  regex=[ isPass ]  ),
        "phone"     : Field( regex=[ isPhone ], rules=[ (lambda v: "--" not in v) ], required=False  ),
        "modified"  : Field( lambda: int( time.time() ) ),
        "timestamp" : Field( lambda: int( time.time() ), fixed=True ),
})
