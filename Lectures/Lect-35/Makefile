
all: Lect-35.html 

FR=../Lect-01/

Lect-35.html: Lect-35.md
	markdown-cli --input=./Lect-35.md --output=Lect-35.html
	echo cat ../../md.css Lect-35.html >/tmp/Lect-35.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-35.html ${FR}/css/hpost >/tmp/Lect-35.html
	mv /tmp/Lect-35.html ./Lect-35.html

