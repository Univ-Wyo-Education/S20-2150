package main

/*
from https://golangcode.com/uploading-a-file-to-s3/

Uploading a File to AWS S3

This example shows how to upload a local file onto an S3 bucket using the Go AWS SDK. Our first step is to step up the
session using the NewSession function. We’ve then created an AddFileToS3 function which can be called multiple times
when wanting to upload many files.

Within the PutObjectInput you can specify options when uploading the file and in our example we show how you can enable
AES256 encryption on your files (when at rest).

For this to work you’ll need to have your AWS credentials setup (with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) and
you’ll need to fill in the S3_REGION and S3_BUCKET constants (More info on bucket regions here).
*/

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

var S3_REGION string
var S3_BUCKET string

var DbOn = make(map[string]bool)

func SetupS3() (s *session.Session) {

	var err error

	// Set at Compile Time
	//	S3_BUCKET = os.Getenv("AWS_REGION")
	//	S3_REGION = os.Getenv("AWS_S3_BUCKET")

	// Create a single AWS session (we can re use this if we're uploading many files)
	s, err = session.NewSession(&aws.Config{Region: aws.String(S3_REGION)})
	if err != nil {
		log.Fatal(err)
	}

	return
}

// AddFileToS3 will upload a single file to S3, it will require a pre-built aws session
// and will set file info like content type and encryption on the uploaded file.
func AddFileToS3(s *session.Session, localFileDir, fileDir string) error {

	// Open the file for use
	file, err := os.Open(localFileDir)
	if err != nil {
		return err
	}
	defer file.Close()

	// Get file size and read the file content into a buffer
	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}
	var size int64 = fileInfo.Size()
	if DbOn["awss3-show-size"] {
		fmt.Printf("size=%d\n", size)
	}
	buffer := make([]byte, size)
	_, err = file.Read(buffer)
	if err != nil {
		return err
	}

	// Config settings: this is where you choose the bucket, filename, content-type etc.
	// of the file you're uploading.
	_, err = s3.New(s).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String(S3_BUCKET),
		Key:                  aws.String(fileDir),
		ACL:                  aws.String("private"), // changed from "private"
		Body:                 bytes.NewReader(buffer),
		ContentLength:        aws.Int64(size),
		ContentType:          aws.String(http.DetectContentType(buffer)), // xyzzy100
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"), // xyzzy101
		Tagging:              aws.String("public=yes&student=yes"),
	})
	return err
}
