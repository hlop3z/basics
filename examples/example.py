import sys

sys.path.append('../basics')


import basics

# Modules
print( basics.__plugins__ )

# Class
basics.__demo__.Plugin().hello()

# Def
basics.__demo__.hello()