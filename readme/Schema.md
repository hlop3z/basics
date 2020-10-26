# Schema
```
from basics.schemas import Field, easy_regex
from basics.schemas import Schema

Person = Schema(
    name = None,
    dob  = Field( rules=[ (lambda v: "x" not in str(v)) ], required=False  ),
)

create = Person.create({
    "name": 'hlop3z',
    "dob" : 9965465,
})

print( create )
```
