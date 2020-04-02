
all: Lect-21.html

FR=../Lect-01/

Lect-21.html: Lect-21.md
	markdown-cli --input=./Lect-21.md --output=Lect-21.html
	echo cat ../../md.css Lect-21.html >/tmp/Lect-21.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-21.html ${FR}/css/hpost >/tmp/Lect-21.html
	mv /tmp/Lect-21.html ./Lect-21.html

