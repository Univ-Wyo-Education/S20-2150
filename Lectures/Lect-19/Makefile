
all: Lect-19.html Zoom.html

FR=../Lect-01/

Lect-19.html: Lect-19.md
	markdown-cli --input=./Lect-19.md --output=Lect-19.html
	echo cat ../../md.css Lect-19.html >/tmp/Lect-19.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-19.html ${FR}/css/hpost >/tmp/Lect-19.html
	mv /tmp/Lect-19.html ./Lect-19.html

# Zoom.md
Zoom.html: Zoom.md
	markdown-cli --input=./Zoom.md --output=Zoom.html
	echo cat ../../md.css Zoom.html >/tmp/Zoom.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Zoom.html ${FR}/css/hpost >/tmp/Zoom.html
	mv /tmp/Zoom.html ./Zoom.html
