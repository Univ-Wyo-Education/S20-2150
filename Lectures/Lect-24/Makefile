
all: Lect-24.html 

FR=../Lect-01/

Lect-24.html: Lect-24.md
	markdown-cli --input=./Lect-24.md --output=Lect-24.html
	echo cat ../../md.css Lect-24.html >/tmp/Lect-24.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-24.html ${FR}/css/hpost >/tmp/Lect-24.html
	mv /tmp/Lect-24.html ./Lect-24.html


