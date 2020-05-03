
all: Lect-33.html 

FR=../Lect-01/

Lect-33.html: Lect-33.md
	markdown-cli --input=./Lect-33.md --output=Lect-33.html
	echo cat ../../md.css Lect-33.html >/tmp/Lect-33.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-33.html ${FR}/css/hpost >/tmp/Lect-33.html
	mv /tmp/Lect-33.html ./Lect-33.html

