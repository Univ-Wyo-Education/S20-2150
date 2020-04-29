#!/Users/pschlump/anaconda3/bin/python

#!/usr/bin/python

import time, signal

def sigHandler ( num, time ):
    print ( "\nCaught signal - ignoring it too!\n", num, time )

signal.signal ( signal.SIGHUP, sigHandler )
signal.signal ( signal.SIGINT, sigHandler )

i = 0
mx = 1000000000
#mx = 100
while i < mx:
    i += 1
    print("\r{}".format(i), end="")
    time.sleep(0.1)

print("\n")
