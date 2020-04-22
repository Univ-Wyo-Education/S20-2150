

all: Lect-28.html 

FR=../Lect-01/

Lect-28.html: Lect-28.md
	markdown-cli --input=./Lect-28.md --output=Lect-28.html
	echo cat ../../md.css Lect-28.html >/tmp/Lect-28.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-28.html ${FR}/css/hpost >/tmp/Lect-28.html
	mv /tmp/Lect-28.html ./Lect-28.html

