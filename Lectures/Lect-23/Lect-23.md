# System Software - Assemblers / Compilers / Linkers

## Videos

[https://youtu.be/QI2gfhcoZCQ - Lect-23-2150-pt1.mp4](https://youtu.be/QI2gfhcoZCQ)<br>
[https://youtu.be/93dSznE6Kcc - Lect-23-2150-pt2.mp4](https://youtu.be/93dSznE6Kcc)<br>
[https://youtu.be/V48tGoIoAL0 - Lect-23-2150-pt3.mp4](https://youtu.be/V48tGoIoAL0)<br>
[https://youtu.be/fAJUEEs2t0g - Lect-23-2150-pt4.mp4](https://youtu.be/fAJUEEs2t0g)<br>
[https://youtu.be/BOumn3whldk - Lect-23-2150-pt5.mp4](https://youtu.be/BOumn3whldk)<br>

From Amazon S3 - for download (same as youtube videos)

[http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt1.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt1.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt2.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt2.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt3.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt3.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt4.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt4.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt5.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-23-2150-pt5.mp4)<br>



## Outside Reading

An interesting article that highlights the importants of computer architecture.
[https://www.theverge.com/2020/4/9/21197162/boeing-737-max-software-hardware-computer-fcc-crash](https://www.theverge.com/2020/4/9/21197162/boeing-737-max-software-hardware-computer-fcc-crash)


## Overview

Picking up on Compilers....

# How do Modern Compilers Work

The picture of a simple compiler is how compiler construction was done in the 1990 and before.
Unfortunately this is also how it is taught in most university settings (Including as far as I know Univ. of Wyo).
This is not how modern compilers work.

The goal of existing compilers is to find things that fail to "compile" - syntax errors and report them to the
user.  

The goal of modern compilers is help provide meaningful information in the development process and to be able
to successfully glen useful information out of the code to help the developer build code.   Not just to do this
but to do this process in near-real time while the person is typing.

Let me give you an example from C++.  You type in inside your main program:

```
	String str;
	str = 
```

At that moment the chunk of code is incomplete and not-syntactically correct.  The real question is given the
"string" type of "str" what can follow the "=" sign and what is the most likely next thing for the user to type.
What can be presented to the user as a correct potential set of values?  Can this information be derived
in under 100ms so that as the user types a pop-up box can help the user.   Can this be done inside a program with
1,000,000 lines of code and 80 different libraries used?

Now the user types a `"` - the beginning of a character constant.

```
	String str;
	str = "
```

The entire context and typing has changed.  We now know that the `=` is an overridden  `=` assignment or 
constructor or const constructor set of operators in the `Sstring` class.  The search space for potential
functions that matches is much smaller.   The code is still not syntactically correct.  The compiler has
to work on syntactically incorrect and incomplete code and produce useful information on the fly.

The key idea in making the compiler work in this environment is that compilation is a service that the
editor can ask about on the fly and get back near instant responses.  The compiler can not afford to
re-build all of the code form scratch.  It has to have a pure-functional data structure that it is
constantly adding to.   This partially complete Abstract Syntax Tree (AST) needs to include not just
what the user has - but also sub-trees of potential future choices that the user may make.

The Solution to this is to have the parse tree and symbol table for the code being compiled saved
for every module that is getting compiled.  Then as the person types it adds new stuff to the
data - if you backup it goes back to the previous version of the data.  Data is only added to,
not updated.  So a change to a global type will flow through all the trees adding this change to
the type - and being almost instantly reflected.   This is called a pure-functional data store.
When you finally finish editing a chunk of code and save it - it has already been compiled.

Then a web interface is added on top to allow the editor to ask for information after every key
stroke.  This is how you get nice pop-up menus with type information as you are editing.


















# Copyright

Copyright (C) University of Wyoming, 2020.

