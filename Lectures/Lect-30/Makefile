
all: Lect-30.html Homework-VM.html

FR=../Lect-01/

Lect-30.html: Lect-30.md
	markdown-cli --input=./Lect-30.md --output=Lect-30.html
	echo cat ../../md.css Lect-30.html >/tmp/Lect-30.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-30.html ${FR}/css/hpost >/tmp/Lect-30.html
	mv /tmp/Lect-30.html ./Lect-30.html


Homework-VM.html: Homework-VM.md
	markdown-cli --input=./Homework-VM.md --output=Homework-VM.html
	echo cat ../../md.css Homework-VM.html >/tmp/Homework-VM.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-VM.html ${FR}/css/hpost >/tmp/Homework-VM.html
	mv /tmp/Homework-VM.html ./Homework-VM.html


