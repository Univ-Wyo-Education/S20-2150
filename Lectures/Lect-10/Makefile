
all: Lect-10.html 

FR=../Lect-01/

Lect-10.html: Lect-10.md
	markdown-cli --input=./Lect-10.md --output=Lect-10.html
	echo cat ../../md.css Lect-10.html >/tmp/Lect-10.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-10.html ${FR}/css/hpost >/tmp/Lect-10.html
	mv /tmp/Lect-10.html ./Lect-10.html

