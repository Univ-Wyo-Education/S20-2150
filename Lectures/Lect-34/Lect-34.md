# Lecture 34 - Last lecture before final review.

## Videos

## Debugging and Profiling Code

So what is debuting - debuting is taking your code and making it
do what you expect instead of why you put into the computer.
Computers are the ultimate literalist.   They do exactly what you
tell them to do - no more and no less.  You have an expectation
that the code will do A, but you told the computer to do B.
It will do B until you change the code.  Debugging is the process
of changing the code to get it to do A.

### Old School

Hardware: Use a Logic Analyzer.  Use a 7 segment display.
Get output.

In Code:  Use print statements.  

Send data to a "log" file.  Or Collect it for remote access later.
Be able to turn-on/off the detail of this information.

Advantages:

1. It is simple.
2. It works on all sorts of environments.
3. It woks remotely.
4. You can look through the output multiple times.
5. It is permanent.
6. It leaves a 'residual trace' of the debugging effort.

Tricks:

Print out the file and line number.  In C/C++:

```
	printf ( "Line No: %d\n", __LINE__ );
```

In Go I developed a package to do this:

```
import "pschlump/godebug"

...

func main() {
	fmt.Printf ( "Line: %s\n", godebug.LF())
}
```

In JavaScript (Node.js and front end):

```
// ln will return the line number that you are currently at - for debuging.
function ln() {
	var stack = stackTrace();
	var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
	do {
		var frame = stack.shift();
	} while (!frameRE.exec(frame) && stack.length);
	return frameRE.exec(stack.shift())[1];
}

console.log ( "Line: ", ln())
```

In Python:

```
from inspect import currentframe

def get_linenumber():
    cf = currentframe()
    return cf.f_back.f_lineno

print "This is line 7, python says line ", get_linenumber()
```

Know when to flush the output!  Normally output is buffered.  If your program is
dying in the middle - then you need to flush the output - wait for the output
to occur before going on.
In C:

```
flush(stdout);
```

In `C++` using `std::`

```
cout << std::flush;
```

There are similar capabilities in other languages.


### Standard Log Files

Windows has a "logging facility" that I find really horrid.  This is because the
only way to access it is via a single GUI tool and it has no search!

Linux/Unix looks at it more like it is a file.  Apache and Nginx log to files.
Lots of other tools log to the standard system log.  Usually you will need to 
take the log and do some data-manipulation to get to what you want in the log.
To get the log you use the commands "log show" or "dmesg".  When I demoed a
few lectures ago with VI on accessing a log I got the log via dmesg, then copied
the file using scp.  Look in /var/log for most log files.

There is a command for sending stuff to the system log from a shell script.

```
$ logger "Hello Logs"
```

On BSD based systems like MacOS

```
$ log show --last 1m | grep Hello
```

On Linux/Unix and System V based Unix

```
# journalctl --since "1m ago" | grep Hello
```

### Debuggers - New School

Python has a "debuger" called pdb.  C/Fortran/C++ you are looking at
things like "gdb".  If you use a compiler based on llvm (XCode on a mac)
then "lldb".  All of these allow you to access and manipulate a
running program.   I use all of them at one time or another.  If you
are working on the Unix/Linux kernel - then look into using "adb".
"adb" is really scary - you can use it to debug a currently running
kernel!

Let's run 'pdb':

```
$ python3 -m pdb demo.py
```

Documentation on pdb: [https://docs.python.org/3/library/pdb.html](https://docs.python.org/3/library/pdb.html).

pdb is represenatative of debuggers - this is a quick overview of the commands.

| C | Command | Description                                                                              |
|---|---------|------------------------------------------------------------------------------------------|
| q | quit    | Exit debugger.                                                                           |
| l | list    | Displays 11 lines around the current line (PC) or continue the previous listing.         |
| s | step    | Execute 1 more line, stop at the first possible occasion.                                |
| n | next    | Continue execution until the next line in the current function is reached or it returns. |
| b | break   | Set a breakpoint - a breakpoint is a place to stop when you run.                         |
| p | print   | Evaluate the expression in the current context and print its value.                      |
| r | return  | Continue execution until the current function returns.                                   |


