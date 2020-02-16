# Homework 02 - Representation of Numbers / ASCII

200 pts total

1. 10pts: Use an ASCII table to figure out what letter decimal 65 (or 97) is from homework 1.  It is the last line in the MARIE program.
2. 40pts: Convert the string "howalive" into hex using an ASCII table.  Remember to include the `\\0` terminator at the end.  With 1 character on each line put this into a list of HEX
specifications for our MARIE assembler.  Use the command line to assemble the result and turn in the .hex file.   How much storage was used for the string (how many bytes/words?)   
Prepend the program below and run it.  Show the output.  (You can also do this with the on-line web based assembler/emulator)
3. 20pts: Convert the number 4313 decimal into octal, binary and hex.
4. 20pts: Convert the number `0b_0110_1001_1100_0001` into decimal.  The `_` are for the human - the number is in binary.
5. 10pts: Use an octal dump to dump the file hw2.bin.  (On Linux and Mac there is an 'od' command.  On windows download the 'od.exe' using chocolatie)
```
H:\> choco install gnuwin32-coreutils.install
```
You will also need to download hw2.bin
6. 30pts: Subtract from -22 (decimal) the value -12 (decimal) using signed arithmetic - Choose 1s or 2s complement for your representation of the negative numbers (p74 and p76)
in the book.  Show every step of your work.  Assume that you are on an 8 bit computer.
7. 30pts: Implement a C program (or C++, Python 3.x, Go, Haskell, F#, Swift, Kotlin) to calculate the Hamming Distance between 19 and 23. 
Turn in your code and the results.  In C/C++/Go use unsigned integers.  Remember to put in  comment with your name so you get the grade for the code.
Perform the calculation by hand to verify your results from the code.  Show your work.
8. 20pts: Using 2's compliment calculate 41 - 18.   Show your work in binary.
9. 10pts: Explain how you would multiply 2 numbers together when you only have an `Add`, `Subt`, `Load`, `Store`, `SkipGt0`, `Jump`, `Output` instructions to work with?
10. 10pts: Find the Unicode representation for the divide symbol.  This is a symbol that looks like a minus with a colon over the top of it.  (Use google to
lookup unicode and find the hex representation for the symbol. 


## Reading Assignment

Read Chapter 2.  Pay special attention to 2.3, 2.4, 2.6.3, 2.7.  We will use Unicode before the end of the class.
Find an ASCII table.  On a Mac and linux you can do `man ascii`.  On windows use google, `man ascii`, to find one.
On Mac/Linux 
```
$ man ascii
```


## Code for (2) above

This uses the extended instruction set specified on p257 of the book.

### For the command line assembler

```
L1,     LoadI    X
        Output
        Load     X
        Add      _1
        Store    X
        LoadI    X
        SkipGt0          / OnLine use "Skipcond 400" - see below
        Jump L1
        Halt
        ORG  20          / OnLine - push down - see below
X,      DEC  22          / Counter of how many characters to output.
_1,     DEC  1
hw,     HEX  48          / 'H' Your values (clue: 48 is not correct for homework-02!)
        HEX 49           / 'I'
        HEX 50           / 'P'
        HEX 51
        HEX 52
        HEX 53
        HEX 54
        HEX 55
        HEX 56
        HEX 0
```

### For the online assembler/runner

```

L1,     LoadI    X
        Output
        Load     X
        Add      _1
        Store    X
        LoadI    X
        Skipcond 400       / 
        Jump L1
        Halt
        DEC  1             / Move data down so X, is at address 20
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
        DEC  1             / Move data down
X,      DEC  22            / Pointer of characters to output.
_1,     DEC  1
hw,     HEX  48            / 'H' Your values (clue: 48 is not correct for homework-02!)
        HEX 49             / 'I'
        HEX 50             / 'P'
        HEX 51
        HEX 52
        HEX 53
        HEX 54
        HEX 55
        HEX 56
        HEX 0
```

## Due

Feb 17 - Monday by end of class.

