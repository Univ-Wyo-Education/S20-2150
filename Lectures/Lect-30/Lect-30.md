# Lecture 30 - Virtual Machines - Jails and Containers

## Vitalization of systems

My first experience with vitalization of systems was the post-office conversion from system IBM 360 to  IBM 370.  They needed more performance - rather than
re-write the old software - they purchased new hardware - the new System 370 came with a "Virtual Machine" that could run 6 OS 360 systems on OS 370 - they 
brought up the 6 systems and - instant results.

Most people did not experience vitalized systems for a long time after this.  The vitalization that was available was a different sort - it is what we call
"containers" to day but it was built into Unix systems - specifically it was a thing called a "jail".  It still exists in FreeBSD today - and if you have 
ever sued Yahoo you are using BSD/Jails.  Basically the idea is to vitalize all the system calls and change files so that processes inside the 
container stay inside the container.   This is OS Level - and it has very little overhead - with some tremendous security advantages.

I run an email-relay system for a company that uses this - purely for the added security.  What is inside the "container" or "jail" is all that the process
can see - so you don't have to include stuff like password files - or - tools - or - much of anything.   Just what the server / service needs to run.
A high level of isolation is achieved.  BSD Jails has this down to a science.  A subset of this is a thing called "chroot".   In a Unix system
this was originally developed for testing new operating systems.  The "root" of the file system is "/" - but what if you create a new test system -
with all the stuff you want to test - and - tell the OS that when this process runs it will use the "/users/pschlump/test1" as the "root" of the 
file system.  The process sees this as "/" -the outside- sees it as /usrs/pschlmp/test1" - so the inside can't get out - it is trapped inside and
can only see what is visible to it.  BSD applies this same principal to system calls - privileges - processes - network interface etc.  You can put
a "process" into a "jail" and it is trapped on the inside - contained from the rest of the OS so that it can not do any harm.  Fantastic 
security.

About the time that this came along - Intel finally built enough new VTx extensions to the x86 processor so that you could build a virtual
machine.  VMWare was created (now a multi-billion dollar business) to take advantage of this and vitalize systems.   This is where you have a
"host" os that runs multiple "virtual" systems - possibly with different OSes and allows for complete emulation of the vital system.
Oracle VirtalBox is one of these that is free to download and use for non-business applications.

