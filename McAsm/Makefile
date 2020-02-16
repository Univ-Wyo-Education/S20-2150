
all:
	go build

windows:
	GOOS=windows go build -o McAsm.pc.exe . 

linux:
	GOOS=linux go build -o McAsm.linux . 

run1:
	go build
	./McAsm --in microcode.m2 --out microcode.hex 


