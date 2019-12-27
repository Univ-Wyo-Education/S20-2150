# Homework 02 - Representation of Numbers / ASCII

200 pts total

1. 10pts: Use an ASCII table to figure out what letter decimal 65 is from homework 1.  It is the last line in the MARIE program.
2. 40pts: Convert the string "howalive" into hex.  Remember to include the `\\0` terminator at the end.  With 1 character on each line put this into a list of HEX
specifications for our MARIE assembler.  Use the command line to assemble the result and turn in the .hex file.   How much storage was used for the string (how many bytes?)   
Prepend the program below and run it.  Show the output.
3. 20pts: Convert the number 4313 decimal into octal, binary and hex.
4. 20pts: Convert the number 0b_0110_1001_1100_0001 into decimal.
5. 10pts: Use an octal dump to dump the file hw2.bin.  (On Linux and Mac there is an 'od' command.  On windows download the 'od.exe' from the class website and use that)
You will also need to download hw2.bin
6. 30pts: Subtract from -22 (decimal) the value -12 (decimal) using signed arithmetic - Choose 1s or 2s complement for your representation of the negative numbers (p74 and p76)
in the book.  Show every step of your work.  Assume that you are on an 8 bit computer.
7. 30pts: Implement a C program (or C++, Python 3, Go, Haskell, F#, Swift) to calculate the Hamming Distance between 19 and 23. 
Turn in your code and the results.  In C/C++/Go use unsigned integers.  Remember to put in  comment with your name so you get the grade for the code.
Perform the calculation by hand to verify your results from the code.  Show your work.
8. 10pts: Compare the set of instructions on p257 for the MARIE assembly code to the set of instructions that are required to do any computation, THE L Machine - or a 
Turing Complete - given in lecture.  Can the MARIE system do any computation?
9. 10pts: Explain how you would multiply 2 numbers together when you only have an `Add` and `Subt` instructions to work with?
10. 10pts: Watch "The Martian" (or read the book, p103 to p110 - supplied in class.) - 49:00 to 52:45 - explain how ASCII and Hex are used?
11. 10pts: Find the Unicode representation for the divide symbol.  This is a symbol that looks like a minus with a colon over the top of it.  (Use google to
lookup unicode and find the hex representation for the symbol. 

## Reading Assignment

Read Chapter 2.  Pay special attention to 2.3, 2.4, 2.6.3, 2.7.  We will use Unicode before the end of the class.
Find an ASCII table.  On a Mac and linux you can do `man ascii`.  On windows use google, `man ascii`, to find one.


## Code for (2) above

This uses the extended instruction set specified on p257 of the book.

```
L1,		LoadI	X
		Output
		Load	X
		Add		_1
		Store	X
		LoadI	X
		SkipGt0			/ OnLine use Skipins 0x400 - same instruction just different human representation.
		Jump L1
		Halt
		ORG 20
X,		DEC 22
_1,		DEC 1
hw,		HEX 48  // Your values
		...
```

## Due

Feb 14 - Friday by midnight.

