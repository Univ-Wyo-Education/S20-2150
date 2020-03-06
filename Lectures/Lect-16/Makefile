
all: Lect-16.html 

FR=../Lect-01/

Lect-16.html: Lect-16.md
	markdown-cli --input=./Lect-16.md --output=Lect-16.html
	echo cat ../../md.css Lect-16.html >/tmp/Lect-16.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-16.html ${FR}/css/hpost >/tmp/Lect-16.html
	mv /tmp/Lect-16.html ./Lect-16.html

