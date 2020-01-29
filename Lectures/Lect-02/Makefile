
all: Lect-02.html  Run-Hw1.html

FR=../Lect-01/

Lect-02.html: Lect-02.md
	markdown-cli --input=./Lect-02.md --output=Lect-02.html
	echo cat ../../md.css Lect-02.html >/tmp/Lect-02.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Lect-02.html ${FR}/css/hpost >/tmp/Lect-02.html
	mv /tmp/Lect-02.html ./Lect-02.html

# Run-Hw1.md
Run-Hw1.html: Run-Hw1.md
	markdown-cli --input=./Run-Hw1.md --output=Run-Hw1.html
	echo cat ../../md.css Run-Hw1.html >/tmp/Run-Hw1.html
	cat ${FR}/css/pre ${FR}/css/markdown.css ${FR}/css/post ../../md.css ${FR}/css/hpre Run-Hw1.html ${FR}/css/hpost >/tmp/Run-Hw1.html
	mv /tmp/Run-Hw1.html ./Run-Hw1.html
