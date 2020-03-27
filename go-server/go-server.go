// Simple HTTP server

package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	flags "github.com/jessevdk/go-flags"
	// "./flags" // "www.2c-why.com/go-lib/flags"
)

var Dir string
var Port string
var GitCommit string

var opts struct {
	Port    string `short:"p" long:"port" description:"A port number, ':Port', to listen on, or a host:port" default:":10000"`
	Dir     string `short:"d" long:"dir" description:"A directory to serve - default '.'" default:"."`
	Version bool   `short:"V" long:"version" description:"Return version info and exit."`
	Key     string `short:"k" long:"key" description:"AuthKey" default:"V7luOm6qurGREm1Ts2W2epA0KrM="`
	Local   bool   `short:"L" long:"local" description:"Local Run of server"`
}

/*
	port := flag.String("p", "3000", "port to serve on")
	directory := flag.String("d", ".", "the directory of static file to host")
	flag.Parse()
*/

func ParseCmdLineArgs() {

	// args, err := flags.ParseArgs(&opts, os.Args)
	_, err := flags.ParseArgs(&opts, os.Args)

	if err != nil {
		panic(err)
		os.Exit(1)
	}

	if opts.Version {
		fmt.Printf("Version (Git Commit): %s\n", GitCommit)
		os.Exit(0)
	}

	if opts.Dir == "." {
		Dir, _ = os.Getwd()
	} else {
		Dir = opts.Dir
	}

	Port = opts.Port

}

// -------------------------------------------------------------------------------------------------
func respHandlerStatus(www http.ResponseWriter, req *http.Request) {
	q := req.RequestURI

	var rv string
	www.Header().Set("Content-Type", "application/json")
	rv = fmt.Sprintf(`{"status":"success", "version":%q, "name":"go-server version 1.0.0", "URI":%q,"req":%s, "response_header":%s}`,
		GitCommit, q, SVarI(req), SVarI(www.Header()))

	io.WriteString(www, rv)
}

// -------------------------------------------------------------------------------------------------
func respHandlerUploadData(www http.ResponseWriter, req *http.Request) {

	// Respond to POST requests - not just GET

	// get params
	//		data
	//		hash
	//		key
	queryValues := req.URL.Query()
	data := queryValues.Get("data")
	key := queryValues.Get("key")
	hash := queryValues.Get("hash")

	// fmt.Printf("go-server: %s key=[%s] hash=[%s] data=[%s]\n", godebug.LF(), key, hash, data)

	data, _ = url.QueryUnescape(data)
	key, _ = url.QueryUnescape(key)
	hash, _ = url.QueryUnescape(hash)

	if db1 {
		fmt.Fprintf(os.Stderr, "data, ->%s<-\n", queryValues.Get("data"))
		fmt.Fprintf(os.Stderr, "key, ->%s<-\n", queryValues.Get("key"))
		fmt.Fprintf(os.Stderr, "hash, ->%s<-\n", queryValues.Get("hash"))
	}

	www.Header().Set("Content-Type", "application/json")

	if key == opts.Key || opts.Key == "" {
		os.Mkdir(fmt.Sprintf("./%s/data", opts.Dir), 0755)
		fn := fmt.Sprintf("./%s/data/%s.txt", opts.Dir, hash)
		err := ioutil.WriteFile(fn, []byte(data), 0644)
		if err == nil {
			fmt.Fprintf(www, `{"status":"success"}`)
		} else {
			fmt.Fprintf(www, `{"status":"error","err":%q}`, err)
			fmt.Fprintf(os.Stderr, `{"status":"error","err":%q}`, err)
		}
	} else {
		fmt.Fprintf(www, `{"status":"error","err":%q}`, "Invalid AuthKey")
	}
}

// -------------------------------------------------------------------------------------------------
func main() {
	ParseCmdLineArgs()
	fs := http.FileServer(http.Dir(Dir))
	http.HandleFunc("/status", respHandlerStatus)
	http.HandleFunc("/upload-data", respHandlerUploadData)

	// Original
	// fs := http.FileServer(http.Dir(Dir))
	// http.Handle("/", http.StripPrefix("/", fs))

	// Modified to pick out ./js
	// directory := "./static"
	// http.Handle("/js/", http.StripPrefix(strings.TrimRight("/js/", "/"), http.FileServer(http.Dir(directory))))

	http.HandleFunc("/", func(www http.ResponseWriter, req *http.Request) {
		www.Header().Set("Cache-Control", "public, max-age=1")
		fs.ServeHTTP(www, req)
	})

	// http.Handle("/", http.FileServer(http.Dir(Dir)))
	// port := "8765"
	// dir := "/home/pschlump/www/sketchground/pjs/99-static/_site"
	// h := http.StripPrefix(pfx, http.FileServer(http.Dir("/home/spyros/src/ sandbox/board/pieces")))
	// http.Handle("/", http.FileServer(http.Dir(Dir)))
	// log.Fatal(http.ListenAndServe(":"+Port, http.FileServer(http.Dir(Dir))))
	log.Fatal(http.ListenAndServe(Port, nil))
}

var db1 = true
