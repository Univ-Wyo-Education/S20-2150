
all:

# start server to run locally
run2:
	~/bin/go-server -p :9000 -d . -k abc &

deploy:
	scp mm_machine.html pschlump@198.58.107.206:/home/pschlump/uw2150/static
	scp mm_machine.html pschlump@198.58.107.206:/home/pschlump/uw2150/static/index.html
	ssh pschlump@198.58.107.206 "mkdir -p ./uw2150/static/js"
	rsync -r -a -v -e "ssh -l pschlump"    ./js            			pschlump@198.58.107.206:/home/pschlump/uw2150/static

