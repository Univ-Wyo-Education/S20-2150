
# Lecture 8 - MARIA instructions

## First - One Hot Example



## Code From Homework 2

This uses the extended instruction set specified on p257 (verison 5) of the book.

Similar C Code:

```
function PrintString () {
	static char hw[] = { 'H','I','P','Q','R','S','T','U', '\0' };
	static char *X = &hw;
	while ( *X ) {
		Output ( *X );
		X++;
	}
}
```

### MARIA Code

```
L1,     LoadI    X
        Output
        Load     X
        Add      _1
        Store    X
        LoadI    X
        SkipGt0            / OnLine use Skipins 0x400 - same instruction just different human representation.
        Jump L1
        Halt
        ORG  20
X,      DEC  22             / Counter of how many characters to output.
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

