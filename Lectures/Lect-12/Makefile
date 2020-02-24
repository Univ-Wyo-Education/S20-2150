
all: Lect-12.html 

FR=../Lect-01/

Lect-12.html: Lect-12.md
	markdown-cli --input=./Lect-12.md --output=Lect-12.html
	echo cat ../../md.css Lect-12.html >/tmp/Lect-12.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-12.html ${FR}/css/hpost >/tmp/Lect-12.html
	mv /tmp/Lect-12.html ./Lect-12.html

