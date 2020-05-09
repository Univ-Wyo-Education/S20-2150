
all: Lect-23.html Homework-05.html

FR=../Lect-01/

Lect-23.html: Lect-23.md
	markdown-cli --input=./Lect-23.md --output=Lect-23.html
	echo cat ../../md.css Lect-23.html >/tmp/Lect-23.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-23.html ${FR}/css/hpost >/tmp/Lect-23.html
	mv /tmp/Lect-23.html ./Lect-23.html

Homework-05.html: Homework-05.md
	markdown-cli --input=./Homework-05.md --output=Homework-05.html
	echo cat ../../md.css Homework-05.html >/tmp/Homework-05.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-05.html ${FR}/css/hpost >/tmp/Homework-05.html
	mv /tmp/Homework-05.html ./Homework-05.html

