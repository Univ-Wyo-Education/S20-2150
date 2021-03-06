1. Pre-record videos
	1. Video Overview
		1. Primary Source youtube.com - links will be provided
		2. Backup Source - aws/s3 - download .mp4's
		3. Assume that internet will be overloaded and intermittent

	1. MARIA Microcode - Overview					10 min
	2. MARIA Run a Test - 							10 min
	3. MARIA Run a Test (2) - 						10 min

	3. MARIA Test List of Tests						10 min
	4. MARIA - what is behind an instruction		xx min
	5. MARIA - Microcode Assembler					10 min

	6. Microcode Architecture						2x 10min
	7. What is missing from our machine MARIA		10min
			machine & real hardware
		- Interupts
		- IO Switches
		- Memory (64k)										

	8. The MARIA microcode emulator  (handout with URLs)
		The Microcode Assembler - download.

	9. Dedicated controllers that use a "microcode" machine
	10. 



20 hrs of lecture

	




https://news.ycombinator.com/item?id=22580520


	

For me the biggest game-changer for online video lectures has been this Chrome plugin that allows for fine-grained
control of video speed: https://chrome.google.com/webstore/detail/video-speed-contro... If you have control over the
courseware platform used for your course, make sure it uses a compatible video player based on html5 video and not some
custom implementation (very rare).

In case video speed controls is not available on your courseware, you can pre-process videos to speed them up to 1.5x
using this script (save as `fastervid.sh` and run on video lectures before uploading)

    #!/bin/bash
    if [ -z $1 ]; then
      echo "usage $0 input_video.mp4"
      exit -1
    fi

    echo "Converting $1 to 1.5x speed..."
    ffmpeg -i "$1"  -filter_complex "[0:v]setpts=0.6666666666666*PTS[v];[0:a]atempo=1.5[a]" -map "[v]" -map "[a]" "tmp-$1"

    echo "Delaying audio of $1 by 60ms"
    ffmpeg -i "tmp-$1" -itsoffset 0.06 -i "tmp-$1" -map "0:0" -map "1:1" -acodec copy -vcodec copy  "faster-$1"

    # cleanup temp file
    rm "tmp-$1"
