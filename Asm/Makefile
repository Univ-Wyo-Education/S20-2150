
all:
	go build

fail_test001:
	go build
	mkdir -p ./ref ./out
	./Asm --in data/test001.mas --out out/test001.hex
	diff out/test001.hex ref


test: test003 test004 test005

test002:
	go build
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
	go build
	mkdir -p out ref
	./asm --in test-code/test-HEX.mas --out ./out/test-HEX.hex -st ./out/test-HEX.st.out
	diff ./out/test-HEX.hex ./ref/test-HEX.hex
	sort -u <out/test-HEX.st.out >,a
	sort -u <ref/test-HEX.st.out >,b
	diff ,a ,b

# test for STR with hex values
# Test for uppler lower op names (Case Insensitive)
test004:
	go build
	mkdir -p out ref
	./asm --in test-code/test-STR.mas --out ./out/test-STR.hex 
	diff ./out/test-STR.hex ./ref/test-STR.hex

# test for CHR with hex values
# Test for uppler lower op names (Case Insensitive)
test005:
	go build
	mkdir -p out ref
	./asm --in test-code/test-CHR.mas --out ./out/test-CHR.hex 
	diff ./out/test-CHR.hex ./ref/test-CHR.hex

