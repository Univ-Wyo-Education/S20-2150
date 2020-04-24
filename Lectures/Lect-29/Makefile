
all: Lect-29.html Homework-Git.html

FR=../Lect-01/

Lect-29.html: Lect-29.md
	markdown-cli --input=./Lect-29.md --output=Lect-29.html
	echo cat ../../md.css Lect-29.html >/tmp/Lect-29.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-29.html ${FR}/css/hpost >/tmp/Lect-29.html
	mv /tmp/Lect-29.html ./Lect-29.html


Homework-Git.html: Homework-Git.md
	markdown-cli --input=./Homework-Git.md --output=Homework-Git.html
	echo cat ../../md.css Homework-Git.html >/tmp/Homework-Git.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-Git.html ${FR}/css/hpost >/tmp/Homework-Git.html
	mv /tmp/Homework-Git.html ./Homework-Git.html


