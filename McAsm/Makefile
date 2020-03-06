
all:
	./cmp-mac.sh McAsm

install: all windows linux
	cp McAsm McAsm.* ../Download/

# GOOS=windows go build -o McAsm.pc.exe . 
windows:
	./cmp-windows.sh

# GOOS=linux go build -o McAsm.linux . 
linux:
	./cmp-linux.sh 

run1:
	./cmp-mac.sh
	./McAsm --in microcode.m2 --out microcode.hex 

run2:
	./cmp-mac.sh
	./McAsm --in microcode.m2 --out microcode.hex  --upload
