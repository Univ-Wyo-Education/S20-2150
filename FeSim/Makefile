
all:
	go build

windows:
	GOOS=windows go build -o FeSim.pc.exe . 

linux:
	GOOS=linux go build -o FeSim.linux . 

install: all windows linux
	cp FeSim FeSim.* ../Download

run_mid_1:
	./FeSim --in mid_1.hex
