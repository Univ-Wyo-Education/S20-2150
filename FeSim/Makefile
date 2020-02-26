
all:
	./cmp-mac.sh

# GOOS=windows go build -o FeSim.pc.exe . 
windows:
	./cmp-windows.sh

# GOOS=linux go build -o FeSim.linux . 
linux:
	./cmp-linux.sh

install: all windows linux
	cp FeSim FeSim.* ../Download

run_mid_1:
	./FeSim --in mid_1.hex
