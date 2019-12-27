# Homework 01 - Setup / Access MARIE

200 pts total

## Part 1 - 100pts

1. Access the online MARIE simulators at [https://marie.js.org/](https://marie.js.org/)
2. Input your first assembly language program and run it (Program is 3 lines in this file - you just have to type it in).
3. Get output from the program.  Submit a screen capture with the program after you have run it.
4. Download the command line assembler for MARIE and command line emulator from:
[https://github.com/Univ-Wyo-Education/S20-2150/tree/master/Download](https://github.com/Univ-Wyo-Education/S20-2150/tree/master/Download)
Verify that you can run the assembler with
```
asm --in pt1.mas --out pt1.hex
```
On a mac us iTerm2 for the terminal, on Windows bring up the power shell.  If you are using Linux then whatever shell you like to use.

Turn in a screen capture of the website with your assembled code.

Turn in the .hex file, `pt1.hex` and the `pt1.mas` with your name in the comment on line 1.

## Part 2 - 100pts

1. Compare the price of a Apple Mac Book Pro to a Dell XPS 15" with a similar configuration.   Assuming that the
Dell will last 4 years and the Mac will last 8 years which one is cheaper per year to own?
2. Turn in a 1 page list (in a text file) of what the features of each computer has and the total price.

## Reading Assignment

Read the index of the book.

Overview the chapters.  Note chapter 4 is on our "machine" MARIE.

Read Preface and Chapter 1.

## Code

Program for Part 1 - step 2 -- Call it pt1.mas:
Use a text editor to create it in `vi` or `vim`.  There are downloads for this on the
PC - look for "portable vim".  On Mac install MacVim.   If you need a tutorial on `vi`
then send me an email or do a google search for vi tutorial.

```
	/ This is a comment: put YOUR NAME in if you want to get a grade!
	Load X
	Output X
	Halt
X,	DEC		65
```

Note on other editors.  Last semester I had people use Notepad, Notepad++ - some of them had
broken code because it was in Unicode / or not in Unicode.  If your editor is breaking your
program and you are not using vi or vim then go and fix your editor.

## Due 

Feb 7 - Friday by midnight.

No late homework on this.  There is very little creative component to this assignment.

