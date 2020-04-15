
all: Lect-25.html 

FR=../Lect-01/

Lect-25.html: Lect-25.md
	markdown-cli --input=./Lect-25.md --output=Lect-25.html
	echo cat ../../md.css Lect-25.html >/tmp/Lect-25.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-25.html ${FR}/css/hpost >/tmp/Lect-25.html
	mv /tmp/Lect-25.html ./Lect-25.html

