
all: Lect-34.html 

FR=../Lect-01/

Lect-34.html: Lect-34.md
	markdown-cli --input=./Lect-34.md --output=Lect-34.html
	echo cat ../../md.css Lect-34.html >/tmp/Lect-34.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-34.html ${FR}/css/hpost >/tmp/Lect-34.html
	mv /tmp/Lect-34.html ./Lect-34.html


