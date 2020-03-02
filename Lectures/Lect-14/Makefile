
all: Lect-14.html Homework-04.html

FR=../Lect-01/

Lect-14.html: Lect-14.md
	markdown-cli --input=./Lect-14.md --output=Lect-14.html
	echo cat ../../md.css Lect-14.html >/tmp/Lect-14.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-14.html ${FR}/css/hpost >/tmp/Lect-14.html
	mv /tmp/Lect-14.html ./Lect-14.html

# Homework-04.md
Homework-04.html: Homework-04.md
	markdown-cli --input=./Homework-04.md --output=Homework-04.html
	echo cat ../../md.css Homework-04.html >/tmp/Homework-04.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-04.html ${FR}/css/hpost >/tmp/Homework-04.html
	mv /tmp/Homework-04.html ./Homework-04.html
