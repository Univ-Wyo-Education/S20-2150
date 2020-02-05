
all: Lect-05.html 

FR=../Lect-01/

Lect-05.html: Lect-05.md
	markdown-cli --input=./Lect-05.md --output=Lect-05.html
	echo cat ../../md.css Lect-05.html >/tmp/Lect-05.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-05.html ${FR}/css/hpost >/tmp/Lect-05.html
	mv /tmp/Lect-05.html ./Lect-05.html


