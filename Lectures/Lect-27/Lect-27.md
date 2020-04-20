# Lecture 27 - Editing with VI / VIM

First there is an on-line tutorial - it is actually very good.

[https://www.openvim.com/](https://www.openvim.com/)

Go and do the tutorial.

Vi is a modal editor.  There is an "insert" mode and an "edit" mode.  Many commands for
editing only work in "edit" mode.  Also there is an "ex" command line mode.

Vi Has a newer more powerful cousin, Vim - that stands for VI Improved.  

## Why Vim - part 1

First it is a super powerful editor.  It can be found on virtually all computers.  I have used it on IBM OS/380 Host, on Supercomputers, on
Mac / Windows / Linux, on my router running a MIPS processor, on my thermostat on the wall.  It works all the time.  You can edit files
that are huge and deal with them.  

Second - People that use it make more money.

Third - it will make you more productive.  Every time you edit and touch the mouse you are loosing your hand position on the keyboard.
VIM is designed to allow you to edit and touch type.  Yes you can use the mouse for some stuff - but most stuff is based on you
keeping your hands in a touch-type position.  VIM is an editor superficially bayed out for touch typing.  A question you should ask
yourself is if you have ever seen a concert pianist hunt-ant peck for the keys?  No... And you should not be hunting and pecking
either.   Most if not all the other editors (with the exception of Emacs) are mousey-hunt-and-peck editors.

## Vim Instalation

Installation of VIM - Windows systems won't come with VI - you will need to install it.
There is a good guide for installing it at: [https://www.instructables.com/id/Install-and-Write-First-Text-File-Using-Vim-on-Win/](https://www.instructables.com/id/Install-and-Write-First-Text-File-Using-Vim-on-Win/)

On the Mac a version of "vi" is pre-installed.  Usually I upgrade this to MacVim.   MacVim is the GUI version of VIM.  There is also the
command line version of vim.  MacVim first.  [https://macvim-dev.github.io/macvim/](https://macvim-dev.github.io/macvim/).  For the
command line I use "brew" the package manager.  You can install brew at: [https://brew.sh/](https://brew.sh/).  Then to install the
command line version of vim - at the Terminal (You can find the terminal in Applications/Utilities):

```
$ brew install vim
$ brew link vim
```

On Linux a minimal version of vim is pre-installed on most distributions.  A full version of vim may require removing the minimal
venison and installing the full version.  A good example of instructions for doing this is 
[https://www.simplified.guide/ubuntu/install-vim](https://www.simplified.guide/ubuntu/install-vim)

On Ubuntu:

```
$ sudo apt remove --assume-yes vim-tiny
$ sudo apt update
$ sudo apt install --assume-yes vim
```


## Why Vim - part 2

Example 1:

Let's say I have a list of tables in a database that I need to turn into just a list of the table names in a JSON input file.
The example file is in ex1.orig.txt and the final is in ex1.json.  Both of these files are in the Lect-27 directory.

Let me demo how to use vim to transform this into the final form.


