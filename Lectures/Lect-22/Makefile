
all: Lect-22.html

FR=../Lect-01/

Lect-22.html: Lect-22.md
	markdown-cli --input=./Lect-22.md --output=Lect-22.html
	echo cat ../../md.css Lect-22.html >/tmp/Lect-22.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-22.html ${FR}/css/hpost >/tmp/Lect-22.html
	mv /tmp/Lect-22.html ./Lect-22.html

