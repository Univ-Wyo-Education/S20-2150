
all: Lect-08.html ins.html

FR=../Lect-01/

Lect-08.html: Lect-08.md
	markdown-cli --input=./Lect-08.md --output=Lect-08.html
	echo cat ../../md.css Lect-08.html >/tmp/Lect-08.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-08.html ${FR}/css/hpost >/tmp/Lect-08.html
	mv /tmp/Lect-08.html ./Lect-08.html

# ins.md
ins.html: ins.md
	markdown-cli --input=./ins.md --output=ins.html
	echo cat ../../md.css ins.html >/tmp/ins.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre ins.html ${FR}/css/hpost >/tmp/ins.html
	mv /tmp/ins.html ./ins.html
