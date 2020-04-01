
all: Lect-20.html 

FR=../Lect-01/

Lect-20.html: Lect-20.md
	markdown-cli --input=./Lect-20.md --output=Lect-20.html
	echo cat ../../md.css Lect-20.html >/tmp/Lect-20.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-20.html ${FR}/css/hpost >/tmp/Lect-20.html
	mv /tmp/Lect-20.html ./Lect-20.html

