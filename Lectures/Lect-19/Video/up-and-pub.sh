#!/bin/bash
 
s3cmd put "$1" s3://uw-s20-2015
s3cmd setacl s3://uw-s20-2015/"$1" --acl-public
