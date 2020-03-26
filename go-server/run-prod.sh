#!/bin/bash

#if [ "$(hostname)" == "prod0001" ] ; then
#	cp prod-cfg.js ./www/js/cfg.js
#else
#	cp dev-cfg.js ./www/js/cfg.js
#fi

xx=$( ps -ef | grep go-server | grep -v grep | awk '{print $2}' )
if [ "X$xx" == "X" ] ; then	
	:
else
	kill $xx
fi

(
while true ; do 
	if [ -f ./set-env.sh ] ; then
		. ./set-env.sh
	fi
	# ./go-server.linux -cfg ./prod-cfg.json -hostport 192.154.97.75:9022 2>&1  >/tmp/go-server.out 
	./go-server -p ":80" -d ./static 2>&1  >/tmp/go-server.out 
	sleep 1 
done
) 2>&1 > /tmp/go-server.2.out &
