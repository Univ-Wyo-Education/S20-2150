
all: Lect-05.html Homework-02.html

FR=../Lect-01/

Lect-05.html: Lect-05.md
	markdown-cli --input=./Lect-05.md --output=Lect-05.html
	echo cat ../../md.css Lect-05.html >/tmp/Lect-05.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-05.html ${FR}/css/hpost >/tmp/Lect-05.html
	mv /tmp/Lect-05.html ./Lect-05.html


Homework-02.html: Homework-02.md
	markdown-cli --input=./Homework-02.md --output=Homework-02.html
	echo cat ../../md.css Homework-02.html >/tmp/Homework-02.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-02.html ${FR}/css/hpost >/tmp/Homework-02.html
	mv /tmp/Homework-02.html ./Homework-02.html

