
all: Lect-26.html 

FR=../Lect-01/

Lect-26.html: Lect-26.md
	markdown-cli --input=./Lect-26.md --output=Lect-26.html
	echo cat ../../md.css Lect-26.html >/tmp/Lect-26.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-26.html ${FR}/css/hpost >/tmp/Lect-26.html
	mv /tmp/Lect-26.html ./Lect-26.html

