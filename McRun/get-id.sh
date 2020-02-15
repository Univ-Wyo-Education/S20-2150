#!/bin/bash

grep "id=" mm_machine.html >,a
sed -e 's/.*id="//' -e 's/".*//' <,a >,b
sort -u <,b >,c
mv ,c id-list.txt
