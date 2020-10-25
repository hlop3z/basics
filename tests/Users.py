import sys

sys.path.append('../')

from basics.schemas import PostgresModel, Field

Users = PostgresModel(
    name   = "users",
    schema = {
        "name" : None,
        "dob"  : Field( rules=[ (lambda v: "x" not in str(v)) ], required=False  ),
})
