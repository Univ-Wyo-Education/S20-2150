
all: user_table.sql 

user_table.sql : user_table.md gen_user
	./gen_user user_table.md  >user_table.sql

gen_user: gen_user.o 

gen_user.o: gen_user.c gen_user.h

