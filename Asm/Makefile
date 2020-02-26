
all:
	./cmp-mac.sh

fail_test001:
	./cmp-mac.sh
	mkdir -p ./ref ./out
	./Asm --in data/test001.mas --out out/test001.hex
	diff out/test001.hex ref

hw2.hex: hw2.mas
	./cmp-mac.sh
	./Asm --in hw2.mas --out hw2.hex --upload

mid_1.hex: mid_1.mas asm.go
	./cmp-mac.sh
	./Asm --in mid_1.mas --out mid_1.hex 
	( cd ../FeSim ; go build )
	../FeSim/FeSim --in mid_1.hex

test: test003 test004 test005

test002:
	./cmp-mac.sh
	mkdir -p ./ref ./out
	./Asm --in data/test002.mas --out out/test002.hex
	diff out/test002.hex ref


windows:
	GOOS=windows go build -o Asm.pc.exe . 

linux:
	GOOS=linux go build -o Asm.linux . 

install: all windows linux
	cp Asm Asm.* ../Download

# test for HEX with hex values
# test symbol table also.
test003:
	./cmp-mac.sh
	mkdir -p out ref
	./asm --in test-code/test-HEX.mas --out ./out/test-HEX.hex -st ./out/test-HEX.st.out
	diff ./out/test-HEX.hex ./ref/test-HEX.hex
	diff out/test-HEX.st.out ref/test-HEX.st.out 

# test for STR with hex values
# Test for uppler lower op names (Case Insensitive)
test004:
	./cmp-mac.sh
	mkdir -p out ref
	./asm --in test-code/test-STR.mas --out ./out/test-STR.hex 
	diff ./out/test-STR.hex ./ref/test-STR.hex

# test for CHR with hex values
# Test for uppler lower op names (Case Insensitive)
test005:
	./cmp-mac.sh
	mkdir -p out ref
	./asm --in test-code/test-CHR.mas --out ./out/test-CHR.hex 
	diff ./out/test-CHR.hex ./ref/test-CHR.hex


