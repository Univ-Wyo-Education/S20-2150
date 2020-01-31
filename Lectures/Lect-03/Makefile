
all: Lect-03.html Command-Line.html

FR=../Lect-01/

Lect-03.html: Lect-03.md
	markdown-cli --input=./Lect-03.md --output=Lect-03.html
	echo cat ../../md.css Lect-03.html >/tmp/Lect-03.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-03.html ${FR}/css/hpost >/tmp/Lect-03.html
	mv /tmp/Lect-03.html ./Lect-03.html

Command-Line.html: Command-Line.md
	markdown-cli --input=./Command-Line.md --output=Command-Line.html
	echo cat ../../md.css Command-Line.html >/tmp/Command-Line.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Command-Line.html ${FR}/css/hpost >/tmp/Command-Line.html
	mv /tmp/Command-Line.html ./Command-Line.html

