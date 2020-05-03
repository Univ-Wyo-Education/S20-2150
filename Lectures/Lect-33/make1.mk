
all: bbb

bbb: bbb.o aaa.o
	cc -o bbb aaa.o bbb.o 

bbb.o: bbb.c aaa.h
aaa.o: aaa.c aaa.h

