
all: bbb

bbb: bbb.o aaa.o
	cc -o bbb aaa.o bbb.o 

bbb.o: bbb.c aaa.h
	cc -c -o bbb.o bbb.c

aaa.o: aaa.c aaa.h
	cc -c -o aaa.o aaa.c

