
all: y.go
	go build 

# go build -o expr main.go y.go

y.go: expr.y main.go
	goyacc -p "expr" expr.y 

test: test_unit test000 test001 test002 test003 test004 test005
	@ echo PASS

test_unit: all
	go test

test000: all
	@ echo "Test 000: ./test/scan_000.txt - prog000.mas"
	@ ./ExprComp --in ./test/scan_000.txt --out ./out/prog000.mas
	@ diff ./out/prog000.mas ./ref/prog000.mas

test001: all
	@ echo "Test 001: ./test/scan_004.txt - prog001.mas"
	@ ./ExprComp --in ./test/scan_004.txt --out ./out/prog001.mas
	@ diff ./out/prog001.mas ./ref/prog001.mas

test002: all
	@ echo "Test 002: ./test/scan_005.txt - prog002.mas"
	@ ./ExprComp --in ./test/scan_005.txt --out ./out/prog002.mas
	@ diff ./out/prog002.mas ./ref/prog002.mas

test003: all
	@ echo "Test 003: ./test/scan_006.txt - prog003.mas"
	@ ./ExprComp --in ./test/scan_006.txt --out ./out/prog003.mas
	@ diff ./out/prog003.mas ./ref/prog003.mas

test004: all
	@ echo "Test 004: ./test/scan_007.txt - prog004.mas"
	@ ./ExprComp --in ./test/scan_007.txt --out ./out/prog004.mas
	@ diff ./out/prog004.mas ./ref/prog004.mas

test005: all
	@ echo "Test 005: prog005.mec -> .mas"
	@ ./ExprComp --in ./test/prog005.mec --out ./out/prog005.mas
	@ diff ./out/prog005.mas ./ref/prog005.mas
