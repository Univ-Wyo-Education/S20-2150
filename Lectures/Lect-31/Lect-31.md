# Lecture 31 - Job Control

## Videos

[https://youtu.be/Pt_F7PQjwkQ - Lect-31-2150.mp4](https://youtu.be/Pt_F7PQjwkQ)<br>
[https://youtu.be/MrWTbOOTkl4 - Lect-31-2150-pt2-more-job-control.mp4](https://youtu.be/MrWTbOOTkl4)<br>
[https://youtu.be/a-sYQTHDSng - Lect-31-pt3-remote-with-ssh.mp4](https://youtu.be/a-sYQTHDSng)<br>
[https://youtu.be/pCBpgt4zjgk - Lect-31-pt4-ubuntu-terminal.mp4](https://youtu.be/pCBpgt4zjgk)<br>

From Amazon S3 - for download (same as youtube videos)

[http://uw-s20-2015.s3.amazonaws.com/Lect-31-2150.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-31-2150.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-31-2150-pt2-more-job-control.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-31-2150-pt2-more-job-control.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-31-pt3-remote-with-ssh.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-31-pt3-remote-with-ssh.mp4)<br>
[http://uw-s20-2015.s3.amazonaws.com/Lect-31-pt4-ubuntu-terminal.mp4](http://uw-s20-2015.s3.amazonaws.com/Lect-31-pt4-ubuntu-terminal.mp4)<br>

## Job Control

Unix introduced the ability to control jobs that you are running.

This will require that you are at the command line in Mac (Terminal or iTerm2)
or using the shell in a VirtualBox machine.   I will use both Mac and Ubuntu on a Virtual 
Macing for the demos in this lecture.

We will be talking about:

1. Job Control
2. Foreground and Background processes
3. Listing existing processes
4. Killing processes
5. Remote system access

## Job Control

When a Unix/Linux shell runs a program it actually starts an independent process
and then by default waits for that process to complete.

Lots of time you wan a program to run but you don't want to wait around for it 
to finish - or you want it to run forever.  A web server for example is a
run-forever program.

Commands to Play with: sleep, demo.py

commands: bg, fg, jobs, kill, ps, grep, vi

| Command/Item | Description |
|---------|---------------------------------------------------------------------------|
| bg 		| background                                                              |
| fg 		| foreground                                                              |
| kill 		| kill (send -INT signal by default)                                      |
| kill -HUP | Send Hangup Signal                                                      |
| kill -INT | send -INT signal                                                        |
| kill -9   | Kill with extreme prejudice (careful!)                                  |
| jobs      | list jobs started by this shell                                         |
| ps 		| Process list - list the processes that I started                        |
| ps -ef	| list all processes (BSD type Linux)                                     |
| ps -aux	| list all processes (System V type Linux)                                |
| `&`       | run process in background                                               |
| `>`       | Pipe standard output to file                                            |
| `>>`      | append standard output to file                                          |
| `2>`      | Pipe standard error to file                                             |
| `|`       | pipe from standard output of 1 program to standard input of 2nd program |
| `%1`      | a process ID for a job that this shell has run                          |
| `~/file`  | the `~` (tilde) referees to the home directory.                         |
| grep      | Pattern match text                                                      |
| find      | look for files in system.                                               |
| tar       | tape archiver                                                           |
| ssh       | login to remote system                                                  |
| for       | for loops in shell                                                      |

