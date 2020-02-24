package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func main() {
	// htmlByte, err := ioutil.ReadFile("midterm-1.html")
	htmlByte, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
	}
	lines := strings.Split(string(htmlByte), "\n")
	n := 1
	for line_no, line := range lines {
		if strings.HasPrefix(line, "<li>") {
			line = fmt.Sprintf(`<li value="%d">%s`, n, line[4:])
			n++
			lines[line_no] = line
		}
	}
	fmt.Printf("%s", strings.Join(lines, "\n"))
}
