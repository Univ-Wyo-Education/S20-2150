
all:
	go build

windows:
	GOOS=windows go build -o McAsm.pc.exe . 

linux:
	GOOS=linux go build -o McAsm.linux . 

run1:
	./cmp-mac.sh
	./McAsm --in microcode.m2 --out microcode.hex 

run2:
	./cmp-mac.sh
	./McAsm --in microcode.m2 --out microcode.hex  --upload
