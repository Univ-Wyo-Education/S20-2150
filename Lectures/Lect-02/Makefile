
all: Lect-02.html 

FR=../Lect-01/

Lect-02.html: Lect-02.md
	markdown-cli --input=./Lect-02.md --output=Lect-02.html
	echo cat ../../md.css Lect-02.html >/tmp/Lect-02.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-02.html ${FR}/css/hpost >/tmp/Lect-02.html
	mv /tmp/Lect-02.html ./Lect-02.html

# Homework.02.md
#Homework.02.html: Homework.02.md
#	markdown-cli --input=./Homework.02.md --output=Homework.02.html
#	echo cat ../../md.css Homework.02.html >/tmp/Homework.02.html
#	cat ./css/pre ./css/markdown.css ./css/post ../../md.css ./css/hpre Homework.02.html ./css/hpost >/tmp/Homework.02.html
#	mv /tmp/Homework.02.html ./Homework.02.html
