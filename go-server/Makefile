all: go-server

setup:
	mkdir -p ./db ./data

build_linux:
	./cmp-prod.sh go-server.linux 
.PHONY: build_linux

mac: all
	mv go-server go-server.mac

# Local run of server
run2: go-server
	( cd ../McRun ; ../go-server/go-server -p :9000 -d . -key "" )

go-server: go-server.go Makefile cmp-local.sh gen_ran.go lib.go asm/asm.go mcasm/mike.go
	@mkdir -p ./db
	./cmp-local.sh


test1:
	go-server --port 4000 --dir ./static

#deploy_74: build_linux
#	echo ssh pschlump@192.154.97.74 "mkdir -p ./q8s/www"
#	echo ssh pschlump@192.154.97.74 "mkdir -p ./q8s/www/static"
#	-echo ssh pschlump@192.154.97.74 "mv ./q8s/www/go-server.linux ,aaaaa"
#	echo scp *.linux pschlump@192.154.97.74:/home/pschlump/q8s/www
#	scp run-prod.sh pschlump@192.154.97.74:/home/pschlump/q8s/www
#	rsync -r -a -v -e "ssh -l pschlump"    ./static            			pschlump@192.154.97.74:/home/pschlump/q8s/www
	
# pschlump@198.58.107.206
deploy: build_linux
	ssh pschlump@198.58.107.206 "mkdir -p ./uw2150/www/static"
	scp *.linux pschlump@198.58.107.206:/home/pschlump/uw2150
	scp run-prod.sh pschlump@198.58.107.206:/home/pschlump/uw2150
	scp www/index.html www/mcasm.html pschlump@198.58.107.206:/home/pschlump/uw2150/static

x:
	rsync -r -a -v -e "ssh -l pschlump"    ./static            			pschlump@198.58.107.206:/home/pschlump/uw2150/www

y:	
	rsync -r -a -v -e "ssh -l pschlump"    ./mcasm            			pschlump@192.168.0.199:/home/pschlump/go/src/github.com/Univ-Wyo-Education/S20-2150/go-server

z:	
	( cd ~/go ; \
	rsync -r -a -v -e "ssh -l pschlump"    ./src            			pschlump@192.168.0.199:/home/pschlump/go \
	)
