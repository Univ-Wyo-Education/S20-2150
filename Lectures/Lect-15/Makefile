
all: Lect-15.html 

FR=../Lect-01/

Lect-15.html: Lect-15.md
	markdown-cli --input=./Lect-15.md --output=Lect-15.html
	echo cat ../../md.css Lect-15.html >/tmp/Lect-15.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-15.html ${FR}/css/hpost >/tmp/Lect-15.html
	mv /tmp/Lect-15.html ./Lect-15.html

