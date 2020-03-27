# Lecture 10

Most of material is from Lecture 9.

```
fucntion strprint ( char *s ) {
	while ( *s ) {
		output(*s);
		s++;
	}							// End
}
```

In MARIE:
(From the homework 2)

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
