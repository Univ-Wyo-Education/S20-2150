
# From: https://superuser.com/questions/138331/using-ffmpeg-to-cut-up-video

ffmpeg -ss 00:08:00 -i Lect-19-pt-01.mp4 \
	-ss 00:01:00 -t 00:01:00 -c copy test1.mp4
