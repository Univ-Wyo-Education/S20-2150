all: README.html syllabus.html 

FR=./Lectures/Lect-01

README.html: README.md
	markdown-cli --input=./README.md --output=README.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre README.html ${FR}/css/hpost >/tmp/README.html
	mv /tmp/README.html ./README.html

syllabus.html: syllabus.md
	markdown-cli --input=./syllabus.md --output=syllabus.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre syllabus.html ${FR}/css/hpost >/tmp/syllabus.html
	mv /tmp/syllabus.html ./syllabus.html

