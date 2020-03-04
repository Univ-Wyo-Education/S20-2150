#!/Users/pschlump/anaconda3/bin/python

# Assuming current python 3.6, 3.7, 3.8

import sys

# print ( 'Number of arguments:', len(sys.argv), 'arguments.' )
# print ( 'Argument List:', str(sys.argv) )

fnIn = ""
fnOut = ""
i = 1
while i < len(sys.argv):
    # print ( i, sys.argv[i] )
    if ( sys.argv[i] == "--in" ):
        i = i + 1
        if ( i >= len(sys.argv) ) :
            print ( "Missing file name after --in" )
            sys.exit()
        fnIn = sys.argv[i]
    elif ( sys.argv[i] == "--out" ):
        i = i + 1
        if ( i >= len(sys.argv) ) :
            print ( "Missing file name after --in" )
            sys.exit()
        fnOut = sys.argv[i]
    else:
        print ( "Invalid argument ", sys.argv[i] )
        sys.exit()
    i = i + 1

if ( fnIn == "" ) :
    print ( "Missing --in <fn> in args" )
    sys.exit()

if ( fnOut == "" ) :
    print ( "Missing --out <fn> in args" )
    sys.exit()


""" TODO: Add more code """

""" Read in Input file into `memory` """

""" Loop until 'Halt' instrcution """

"""         Fetch """

"""         Execute """


