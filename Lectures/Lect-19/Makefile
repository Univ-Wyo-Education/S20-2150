

all: Lect-19.html 

FR=../Lect-01/

Lect-19.html: Lect-19.md
	markdown-cli --input=./Lect-19.md --output=Lect-19.html
	echo cat ../../md.css Lect-19.html >/tmp/Lect-19.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-19.html ${FR}/css/hpost >/tmp/Lect-19.html
	mv /tmp/Lect-19.html ./Lect-19.html

# Homework-03.md
Homework-03.html: Homework-03.md
	markdown-cli --input=./Homework-03.md --output=Homework-03.html
	echo cat ../../md.css Homework-03.html >/tmp/Homework-03.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-03.html ${FR}/css/hpost >/tmp/Homework-03.html
	mv /tmp/Homework-03.html ./Homework-03.html
