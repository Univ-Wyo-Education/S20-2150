

all: Lect-27.html 

FR=../Lect-01/

Lect-27.html: Lect-27.md
	markdown-cli --input=./Lect-27.md --output=Lect-27.html
	echo cat ../../md.css Lect-27.html >/tmp/Lect-27.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-27.html ${FR}/css/hpost >/tmp/Lect-27.html
	mv /tmp/Lect-27.html ./Lect-27.html

