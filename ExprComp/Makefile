


all: y.go
	go build 

# go build -o expr main.go y.go

y.go: expr.y main.go
	goyacc -p "expr" expr.y 
