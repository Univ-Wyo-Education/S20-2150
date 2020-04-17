# Lecture 25 - System Software

## Videos

[https://youtu.be/e8-vSbrHd_8 - Lect-26-2150-pt1.mp4](https://youtu.be/e8-vSbrHd_8)<br>
[https://youtu.be/PSIrGiWvWHg - Lect-26-2150-pt2.mp4](https://youtu.be/PSIrGiWvWHg)<br>
[https://youtu.be/Gvo0-6umdKY - Lect-26-2150-pt3.mp4](https://youtu.be/Gvo0-6umdKY)<br>
[https://youtu.be/Qp_DgH6Py_4 - Lect-26-2150-pt4.mp4](https://youtu.be/Qp_DgH6Py_4)<br>
[https://youtu.be/_I3zcSE4P_c - Lect-26-2150-pt5.mp4](https://youtu.be/_I3zcSE4P_c)<br>
[https://youtu.be/vSMKOvXOIyc - Lect-26-2150-pt6-Microcode-Notes1.mp4](https://youtu.be/vSMKOvXOIyc)<br>

From Amazon S3 - for download (same as youtube videos)

[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt1.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt1.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt2.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt2.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt3.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt3.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt4.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt4.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt5.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt5.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt6-Microcode-Notes1.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-26-2150-pt6-Microcode-Notes1.mp4)<br>

# relative and absolute paths

So what is a "relative" path and an "absolute" path?

You are at a location in the file system.  You can find this out with the "pwd" command.
This "prints the working directory".

```
$ pwd
/Users/pschlump/go/src/github.com/Univ-Wyo-Education/S20-2150/Lectures/Lect-25
```

Paths that are "absolute" start with "/".  The "/" is the file separator.  On windows
it is a "back-slash".   That is the "\\" character.   Backslashes have the top leaning
to the left.  Slash is the same as the "division" operator.

So my path starts out at the "top" with "/Users".  On most Linux systems it will start
out with "/home".  On Windows it usually starts with "C:\\".
If you use the MinGW bash shell on windows you get "/c/" as the top of the system.
One of the innovations of Unix in the late 1960s and early 1970s was to replace
"special device" names with just paths in the file system.  This made it much
easier for all commands to deal with these devices in a uniform way.  Another file
that you can create on a Unix/Linux system that will annoy Windows users is the
file "nul".  There is a Unix/Linux tool "cp" to copy a file.  It is "cp from to"
so...


```
cp abc.exe nul
```

That won't work on Widows.  It is also very interesting to send file attachments
to windows users with a file called "nul".   This usually involves some very
frustrated laughs.























## File Extensions

Just using the "extension" on a file to determine the file type falls down a lot.
For example.  Let's say that I have a Structured Vector Graphics file - an image
specified in a text format.  I would like to edit it with my text editor to change
it.

For example the 7 segment display with file.  7-seg-1.svg.  Let's cat it.

```
$ cat 7-seg-1.svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="192px" height="320px" viewBox="-1 -1 12 20">
<g id="abcdefg" style="fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;">
  <polygon id="a" points=" 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" fill="#bbbbbb"/>
  <polygon id="b" points=" 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" fill="#ff0000"/>
  <polygon id="c" points=" 9, 9 10,10 10,16  9,17  8,16  8,10" fill="#ff0000"/>
  <polygon id="d" points=" 9,17  8,18  2,18  1,17  2,16  8,16" fill="#bbbbbb"/>
  <polygon id="e" points=" 1,17  0,16  0,10  1, 9  2,10  2,16" fill="#bbbbbb"/>
  <polygon id="f" points=" 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" fill="#bbbbbb"/>
  <polygon id="g" points=" 1, 9  2, 8  8, 8  9, 9  8,10  2,10" fill="#bbbbbb"/>
</g>
</svg>
```

So SVG is a text format.
We can edit it with a text editor.  In fact the 1st line in it indicates that it is an XML file.
XML is a text format!

But it is also an "image"  We can convert it to a .png - a binary image format.  You probably don't
have it installed on your system but there is a command that reads SVG and outputs .png.

```
/usr/local/bin/rsvg-convert 7-seg-1.svg > 7-seg-1.png
```

Then you can look at it as an image.

![7-seg-1.png](7-seg-1.png)

You browser can also display it as an image.  The Graphics for "http://www.2c-why.com/" are all done in SVG.

What happens when you "double" click on it?  On a default mac it comes up in the browser.  On my system it
shows up in Visual Studio Code as an image.  What fails to happen is it showing up in an editor for text
to edit it.

This is a incomplete list of programs that could be associated with ".svg" on my system - I use all of them!

| Program | Description |
|----------|------------|
| Google Chrome  | browser |
| FiireFox  | browser |
| InkScape | image editor |
| Adobe Illustrator | image editor |
| gimp | image editor |
| opera | browser |
| MacVim | editor |
| Vim | editor |
| Atom | editor |
| Microsoft Visual  Studio | editor / IDE |
| AutoDesk sketchbook | image editor |
| hugin | image processing tool |
| Preview | image display tool |
| Safiri | browser |
| screenflow | screen capture tool |
| textedit | text editor |
| XCode | Apple development IDE |
| PyCharm | Python IDE |
| xml-explore | XML data editor |
 
These are just the programs that are GUI based - not all the command line tools that I use to process
images!

So which one should be "associated" with .svg?     On any given day I might use 5 to 10 of these!












## ls - directory listing

`ls` lists the contents of a directory.

`ls -l` long list.

File permissions.

`ls -ltro` list in reverse order based on time.

`ls -al` list all the files.

`ls -1` list in 1 column.




# mkdir and rmdir.

Create and remove directories.

```
$ mkdir t1
$ ls >t1/ls-out
$ rmdir t1
$ rm t1/ls-out
$ rmdir t1
```






## Pipes

`cat a.txt b.txt > all.txt` - why is "cat" a for concatenate.

`cat -n a.txt b.txt > nnn.txt`

`cat a.txt a.txt a.txt > 3.txt` - make 3 copies.

`cat -n a.txt | grep 3`



## Wild Cards

`ls *.txt`

`echo *.txt`

`ls 7*`







## So Far..

| Command | Description                                                       |
|--------|--------------------------------------------------------------------|
| cat    | concatenate files or list to screen.                               |
| mv     | rename, "mv from to" or change path, "mv old/path new/path".       |
| ls     | list a directory.                                                  |
| rm     | remove a file, or list of files.                                   |
| mkdir  | create a directory.                                                |
| rmdir  | remove an empty directory.                                         |
| pwd    | current working directory.                                         |
| cd     | change current working directory.                                  |
| man    | get manual pages.                                                  |
| grep   | (g)lobal (r)egular (e)xpression (p)rint.                           |
| ps     | list processes.                                                    |
| kill   | kill a process by process id.                                      |
| awk    | a programming language                                             |
| cut    | pick a column.                                                     |
| chmod  | change permissions on a file.                                      |
| `#!`   | Scripts running a tool.                                            |













# Copyright

Copyright (C) University of Wyoming, 2020.

