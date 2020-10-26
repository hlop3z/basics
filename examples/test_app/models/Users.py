from peewee import *

db = SqliteDatabase('database_test.db')

class Users(Model):
    name = CharField()
    dob  = IntegerField()

    class Meta:
        database = db

db.create_tables([ Users ])
