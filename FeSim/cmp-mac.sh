#!/bin/bash

if [ "$(hostname)" == "ub004" ] ; then
	echo Setting Env
	export GOPATH=~/go
	export LD_LIBRARY_PATH=/usr/local/lib
	export PATH="$GOPATH/bin:/usr/local/go/bin:$PATH"
fi

if [ "$*" ==  "" ] ; then
	:
else
	OUT=" -o $* "
fi


export GIT_COMMIT=`git rev-list -1 HEAD` && \
	go build \
		-ldflags "-X main.GitCommit=${GIT_COMMIT}-$(date|sed -e 's/ /-/g')" \
		${OUT} && \
	echo "local:  " ${GIT_COMMIT} `date` >>build-log.txt 


