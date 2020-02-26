#!/bin/bash

if [ "$(hostname)" == "ub004" ] ; then
	echo Setting Env
	export GOPATH=~/go
	export LD_LIBRARY_PATH=/usr/local/lib
	export PATH="$GOPATH/bin:/usr/local/go/bin:$PATH"
fi

if [ "$*" ==  "" ] ; then
	OUT=" -o Asm.pc.exe "
else
	OUT=" -o $* "
fi

# export AWS_REGION=us-east-1
# export AWS_ACCESS_KEY_ID=X
# export AWS_SECRET_ACCESS_KEY="X"
# export AWS_SECRET_KEY="X"
export AWS_S3_BUCKET="s3://uw-s20-2015"
export AWS_S3_BUCKET="uw-s20-2015"

cat >ver.go <<XxXx
package main

func init() {
	S3_REGION = "${AWS_REGION}"
	S3_BUCKET = "${AWS_S3_BUCKET}"
}
XxXx

cat ver.go

export GIT_COMMIT=`git rev-list -1 HEAD` && \
	echo "Version: ${GIT_COMMIT}" && \
	echo "AWS Region: ${AWS_REGION}" && \
	GOOS=windows go build \
		-ldflags "-X main.GitCommit=${GIT_COMMIT}-$(date|sed -e 's/ /-/g')" \
		${OUT} && \
	echo "local:  " ${GIT_COMMIT} `date` >>build-log.txt 

if [ -f ./ver.go ] ; then
	rm -f ./ver.go
fi

