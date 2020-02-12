
all: Lect-06.html Homework-02.html

FR=../Lect-01/

Lect-06.html: Lect-06.md
	markdown-cli --input=./Lect-06.md --output=Lect-06.html
	echo cat ../../md.css Lect-06.html >/tmp/Lect-06.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-06.html ${FR}/css/hpost >/tmp/Lect-06.html
	mv /tmp/Lect-06.html ./Lect-06.html

# Homework-02.md
Homework-02.html: Homework-02.md
	markdown-cli --input=./Homework-02.md --output=Homework-02.html
	echo cat ../../md.css Homework-02.html >/tmp/Homework-02.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Homework-02.html ${FR}/css/hpost >/tmp/Homework-02.html
	mv /tmp/Homework-02.html ./Homework-02.html

# Answer-02.md
Answer-02.html: Answer-02.md
	markdown-cli --input=./Answer-02.md --output=Answer-02.html
	echo cat ../../md.css Answer-02.html >/tmp/Answer-02.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Answer-02.html ${FR}/css/hpost >/tmp/Answer-02.html
	mv /tmp/Answer-02.html ./Answer-02.html
