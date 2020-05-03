# Lecture 33 - Meta Programming

## Videos


## make and other build tools

These days there are a plethora of "build" tools - most of them do not do as much as `make`.
`make` uses the observation that the output of a process will usually be later in time than
the set of inputs.  So if you have:

```
an_output: Input1 Input2 Inpute3 ... InputN
	Do-Dometing
```

then you can decide when to do the `Do-Domehing` when you have an error in the ordering
of the output is build from the input.  This can get quite complex when there are a
lot of inputs!

This can also get quite tedious when you have to track and manage the inputs and how
they get built.

Skipping the dependency tree - means full re-builds.  Docker is notorious for the time
it takes to do full rebuilds.  Basically by skipping this rule it oworks like this:

1. You are good - 1 sec
1. You are good - 2 sec
1. You are good - 1 sec
1. You are good - 3 sec
1. You are good - 5 sec
1. You are good  - 1 sec
1. Oops - full rebuild and start over - 30 mints

Other systems that tend to ignore this like, "maven" and "eclipse" are notorious for
builds that take 1/2 hour to an hour on a large system.

So how dose `"make`" work internally - there is a system called a "topological sort"
that allows it to figure out complex dependency trees.  Other systems like Excel
and Haskell use this also to figure out how to run stuff in order.

So ... `"make`"

By default `make` uses the file "Makefile" or "makefile" or you can specify a "-f" option
to get a different file.

The basic structure is :

```

default_rule_name:  Dependency1 Dependency2
	Command Line Stuff to run for this rule


Dependency1: DependsOn1 DependsOn2
	Do Something

Dependency2:
	Do Something 1
	Do Something 2
	Do Something 3

```

So if I have a program `aaa.c` and it includes the file `aaa.h` - but we just want to compile to an
object file, then we want this to link with `bbb.c` (the main program)

```

all: bbb

bbb: bbb.o aaa.o
	cc -o bbb aaa.o bbb.o 

bbb.o: bbb.c aaa.h
	cc -c -o bbb.o bbb.c

aaa.o: aaa.c aaa.h
	cc -c -o aaa.o aaa.c


```

`make` will also stop when there is an error reported from a command.

Let's put a syntax error into `aaa.c` and see what happens.

`make` also has  a large set of default rules (the default rules can be extended also).

So... `make1.mk`

```
all: bbb

bbb: bbb.o aaa.o
	cc -o bbb aaa.o bbb.o 

bbb.o: bbb.c aaa.h
aaa.o: aaa.c aaa.h

```

Also works.


## 2000s book - Pragmatic Programmer and Don't Repeat Yourself = DRY

The "Pragmatic Programmer" inspired the creation of languages like Ruby and Python.
This principal, DRY, is the most important one in the boot (Lot's of stuff in the
book is really good - event 20 years later!

Let's take a look at a build system for a database table.

A table in a database is a collection of rows with data types.  Let's say this is
a "user" table - it has username and password and the persons real name.

### Table: user

| Column Name  | Column Type | Index | Description                                     |
|--------------|-------------|-------|-------------------------------------------------|
| id           | uuid        | PK    | Unique generated ID for this tables row         |
| username     | text        | UK    | the name of the user (usually an email address) |
| real_name    | text        | P     | persons name                                    |
| password_enc | text        |       | encrypted password for user                     |

What we need is the SQL command to create the table,  the indexes for the table, and the comments on the table
and the sample query, and the code that performs select, update, delete, insert on
the row of the table.

Let's build a "meta program" that reads in the table above and converts that into all of these.

First the makefile, make2.mk

```
all: user.sql user_crud.c

user.sql : table.md gen_user

gen_user: gen_user.c user_info.h	

gen_user.c: gen_user.c gen_user.h

xyzzy

```


## Building your own tools

## DevOps - Tools and Dev replacement for ID and Operations

DevOps brings rigger via testing to the entire process of system administration.  It also brings
scale.


