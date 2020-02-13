package main

// <script src="https://gist.github.com/hiyali/6e3dd0b17d44ae92c1222011d6a6df8f.js"></script>
//
// Upload file to amazon s3 with s3 filepath on golang
//  upload-file-to-amazon-s3-golang.md
// syncer.go
// /*
//   https://docs.aws.amazon.com/cli/latest/reference/s3api/put-object-acl.html
//   https://docs.aws.amazon.com/zh_cn/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html
//   https://github.com/awslabs/aws-go-wordfreq-sample/blob/master/cmd/uploads3/main.go
//   https://docs.aws.amazon.com/sdk-for-go/api/aws/
//
//   1. Create bucket in s3 & get the keys
//   - login to UI web aws s3 interface
//   - go to S3 service
//   - create a Bucket called SomeBucket in the desired region
//   2. Install dependencies & configure aws keys
//   - sudo apt install awscli
//   - first configure your aws credentials run: aws configure
//   - go get -u github.com/aws/aws-sdk-go/aws
//   - go get -u github.com/hiyali/logli (for logging)
//   3. Configure this tool & run
//   - configure constants (S3_**) of this file for your s3 bucket
//   - go run syncer.go filename s3-filepath (e.g.: go run syncer.go ../downloads/Beyoncé/Beyoncé-Halo.mp3 Beyoncé/Halo.mp3)
// */
// /* Enjoy the codes (github.com/hiyali)
//    go build -o syncer (ONCE)
//    syncer filename s3-filepath
// */

import (
	"bytes"
	"io" // "net/http"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	log "github.com/hiyali/logli"
)

const (
	S3_REGION = "us-east-1"
	S3_BUCKET = "uw-s20-2015"
	S3_ACL    = "private"
	// S3_ACL    = "public-read"
)

type S3Handler struct {
	Session *session.Session
	Bucket  string
}

func main() {
	if len(os.Args) != 3 {
		log.FatalF("usage: %s <filename> <s3-filepath>\n", filepath.Base(os.Args[0]))
	}

	filename := os.Args[1]
	key := os.Args[2]

	file, err := os.Open(filename)
	if err != nil {
		log.FatalF("os.Open - filename: %v, err: %v", filename, err)
	}
	defer file.Close()

	sess, err := session.NewSession(&aws.Config{Region: aws.String(S3_REGION)})
	if err != nil {
		log.FatalF("session.NewSession - filename: %v, err: %v", filename, err)
	}

	handler := S3Handler{
		Session: sess,
		Bucket:  S3_BUCKET,
	}

	// contents, err := handler.ReadFile(filename)
	// if err != nil {
	// 	log.FatalF("ReadFile - filename: %v, err: %v", filename, err)
	// }

	err = handler.UploadFile(key, filename)
	if err != nil {
		log.FatalF("UploadFile - filename: %v, err: %v", filename, err)
	}
	log.Info("UploadFile - success")
}

func (h S3Handler) UploadFile(key string, filename string) error {
	file, err := os.Open(filename)
	if err != nil {
		log.FatalF("os.Open - filename: %s, err: %v", filename, err)
	}
	defer file.Close()

	// buffer := []byte(body)

	_, err = s3.New(h.Session).PutObject(&s3.PutObjectInput{
		Bucket:             aws.String(h.Bucket),
		Key:                aws.String(key),
		ACL:                aws.String(S3_ACL),
		Body:               file, // bytes.NewReader(buffer),
		ContentDisposition: aws.String("attachment"),
		// ContentLength:      aws.Int64(int64(len(buffer))),
		// ContentType:        aws.String(http.DetectContentType(buffer)),
		// ServerSideEncryption: aws.String("AES256"),
	})

	// log.DebugF("s3.New - res: %v", res)
	return err
}

func (h S3Handler) ReadFile(key string) (string, error) {
	results, err := s3.New(h.Session).GetObject(&s3.GetObjectInput{
		Bucket: aws.String(h.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return "", err
	}
	defer results.Body.Close()

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, results.Body); err != nil {
		return "", err
	}
	return string(buf.Bytes()), nil
}

// Usage
// go run syncer.go filename s3-filepath
// Example:
//
// go run syncer.go ../downloads/Beyoncé/Beyoncé-Halo.mp3 Beyoncé/Halo.mp3
// Or
//
// go build -o syncer # ONCE
// syncer filename s3-filepath
// Tell U something
// Sync all local files to s3
//
// aws s3 sync . s3://mybucket [--acl <value>] [--delete]
// Change all files mime types
//
// aws s3 cp s3://music-of-pomm/  s3://music-of-pomm/ --exclude '*' --include '*.mp3' \
// 	--no-guess-mime-type --content-type="audio/mpeg" --metadata-directive="REPLACE" --recursive --acl="public-read"
// etc
//
