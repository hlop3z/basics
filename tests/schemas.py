import sys

sys.path.append('../')

import basics



easy_regex = basics.schemas.easy_regex
Field = basics.schemas.Field



import hashlib, time

def hash_password(value):
    return hashlib.blake2s( value.encode('utf-8'), digest_size=8 ).hexdigest()

_isPass     = lambda v: """^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\\?\/\|!@#\$%\^&\*><,\."'])(?=.{"""+str(v)+""",})"""
isPass      = _isPass(8) # AT LEAST ONE OF EACH (a-z, A-Z, 0-9) and AT LEAST ONE OF ( . , \ / < > ? ! @ # $ % ^ & * | )
isUsername  = easy_regex('a-z0-9_', 2)
isPhone     = '^\+?(\d.*){6,}$'

MySchemas = [
    {
        "name": "users",
        "schema": {
            "id"        : Field( required=False  ),
            "group"     : Field( None, choices=['customers', 'admins', 'employees', 'partners', 'investors'] ),
            "username"  : Field( regex=[ isUsername ], validators=[ (lambda v: "__" not in v) ]  ),
            "password"  : Field( method=hash_password,  regex=[ isPass ]  ),
            "phone"     : Field( regex=[ isPhone ], rules=[ (lambda v: "--" not in v) ], required=False  ),
            "modified"  : Field( lambda: int( time.time() ) ),
            "timestamp" : Field( lambda: int( time.time() ), fixed=True ),
        }
    },


    {
        "name": "wallets",
        "schema": {
            "name" : None,
            "dob"  : Field( rules=[ (lambda v: "x" not in str(v)) ], required=False  ),
        }
    },
]


bps   = basics.schemas.Models( MySchemas, True )
model = bps.model
#print( bps.models )

print(
    model['wallets']['create'](
        form    = { "name" : 'HECTOR', "dob": "10/10/1992" }
    )
)
print(
    model['wallets']['find'](
        query   = { "id": { "lt" : 9 } },
        fields  = ['name'],
        sort_by = '-id',
        page    = { "page": 2, "size": 100 }
    )
)
print(
    model['wallets']['update'](
        form    = { "name": "john" },
        query   = { "id": { "eq" : 9 } }
    )
)
print(
    model['wallets']['delete'](
        query   = { "id": { "eq" : 9 } }
    )
)

#LITE CREATE    - tx.execute( *active.data )
#LITE ROW       - tx.fetchrow( *active.data )
#LITE READ      - tx.fetch( *active.data )
#LITE DELETE    - tx.execute( *active.data )