
all: Lect-11.html 

#Homework-03.html

FR=../Lect-01/

Lect-11.html: Lect-11.md
	markdown-cli --input=./Lect-11.md --output=Lect-11.html
	echo cat ../../md.css Lect-11.html >/tmp/Lect-11.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-11.html ${FR}/css/hpost >/tmp/Lect-11.html
	mv /tmp/Lect-11.html ./Lect-11.html

# Homework-03.md
Homework-03.html: Homework-03.md
	markdown-cli --input=./Homework-03.md --output=Homework-03.html
	echo cat ../../md.css Homework-03.html >/tmp/Homework-03.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-03.html ${FR}/css/hpost >/tmp/Homework-03.html
	mv /tmp/Homework-03.html ./Homework-03.html
