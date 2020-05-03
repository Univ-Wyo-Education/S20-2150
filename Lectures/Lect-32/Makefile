

all: Lect-32.html 

FR=../Lect-01/

Lect-32.html: Lect-32.md
	markdown-cli --input=./Lect-32.md --output=Lect-32.html
	echo cat ../../md.css Lect-32.html >/tmp/Lect-32.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-32.html ${FR}/css/hpost >/tmp/Lect-32.html
	mv /tmp/Lect-32.html ./Lect-32.html

