
all: Lect-03.html 

FR=../Lect-01/

Lect-03.html: Lect-03.md
	markdown-cli --input=./Lect-03.md --output=Lect-03.html
	echo cat ../../md.css Lect-03.html >/tmp/Lect-03.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-03.html ${FR}/css/hpost >/tmp/Lect-03.html
	mv /tmp/Lect-03.html ./Lect-03.html

# Homework.03.md
#Homework.03.html: Homework.03.md
#	markdown-cli --input=./Homework.03.md --output=Homework.03.html
#	echo cat ../../md.css Homework.03.html >/tmp/Homework.03.html
#	cat ./css/pre ./css/markdown.css ./css/post ../../md.css ./css/hpre Homework.03.html ./css/hpost >/tmp/Homework.03.html
#	mv /tmp/Homework.03.html ./Homework.03.html
