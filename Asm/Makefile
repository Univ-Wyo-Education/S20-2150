
all:
	go build

fail_test001:
	go build
	mkdir -p ./ref ./out
	./Asm --in data/test001.mas --out out/test001.hex
	diff out/test001.hex ref


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
