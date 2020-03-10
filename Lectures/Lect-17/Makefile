
all: Lect-17.html 

FR=../Lect-01/

Lect-17.html: Lect-17.md
	markdown-cli --input=./Lect-17.md --output=Lect-17.html
	echo cat ../../md.css Lect-17.html >/tmp/Lect-17.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-17.html ${FR}/css/hpost >/tmp/Lect-17.html
	mv /tmp/Lect-17.html ./Lect-17.html


cow.html: cow.md
	markdown-cli --input=./cow.md --output=cow.html
	echo cat ../../md.css cow.html >/tmp/cow.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre cow.html ${FR}/css/hpost >/tmp/cow.html
	mv /tmp/cow.html ./cow.html

