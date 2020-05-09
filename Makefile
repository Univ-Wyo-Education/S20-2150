
all: README.html syllabus.html midterm-review.html final-1.html

FR=./Lectures/Lect-01

README.html: README.md
	markdown-cli --input=./README.md --output=README.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre README.html ${FR}/css/hpost >/tmp/README.html
	mv /tmp/README.html ./README.html

syllabus.html: syllabus.md
	markdown-cli --input=./syllabus.md --output=syllabus.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre syllabus.html ${FR}/css/hpost >/tmp/syllabus.html
	mv /tmp/syllabus.html ./syllabus.html


others: midterm-1.html midterm-review.html

midterm-1.html: midterm-1.md
	markdown-cli --input=./midterm-1.md --output=midterm-1.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre midterm-1.html ${FR}/css/hpost >/tmp/midterm-1.html
	mv /tmp/midterm-1.html ./midterm-1.html
	go run re-val.go midterm-1.html >midterm-1.v1.html
	mv midterm-1.v1.html midterm-1.html 

midterm-review.html: midterm-review.md
	markdown-cli --input=./midterm-review.md --output=midterm-review.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre midterm-review.html ${FR}/css/hpost >/tmp/midterm-review.html
	mv /tmp/midterm-review.html ./midterm-review.html
	go run re-val.go midterm-review.html >midterm-review.v1.html
	mv midterm-review.v1.html midterm-review.html

final-1.html: final-1.md
	markdown-cli --input=./final-1.md --output=final-1.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ./md.css ${FR}/css/hpre final-1.html ${FR}/css/hpost >/tmp/final-1.html
	mv /tmp/final-1.html ./final-1.html
	go run re-val.go final-1.html >final-1.v1.html
	mv final-1.v1.html final-1.html 

