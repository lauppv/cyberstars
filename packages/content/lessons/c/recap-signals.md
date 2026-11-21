SIGCHLD, a timer, sigsuspend and kill in one program: jobs that run at the same time, with one shared deadline

---

## Mission: The Deadline

The night shift starts all its jobs at once, but the machine room closes in half a second. Whatever is still running then gets stopped. In the morning, the shift chief wants to know which jobs finished, and how

1. Install two handlers with sigaction. The SIGCHLD handler collects ended children in a loop with waitpid, -1 and WNOHANG, finds each one's position by its PID, and saves its exit status. The SIGALRM handler only sets a flag
2. Block SIGCHLD and SIGALRM. Read commands, one per line, until the input ends, and start each one in its own child with execvp. If exec fails, the child exits with 127
3. Start a 500 ms timer with setitimer. Wait with sigsuspend until every child is collected or the timer rings, whichever comes first
4. If the timer rang, send SIGTERM to every child that hasn't ended, then wait for each of those with waitpid
5. Print one line per command, in the order of the input: `exit` and its status for a job that ended by itself, `stopped` for one you stopped. Then print the two counts, as in the example

Call fflush(stdout) before every fork. There are from 1 to 10 commands. They print nothing and read nothing

**Example**

Input

```text
true
sleep 30
test 1 -gt 2
sleep 0
```

Output

```text
1: exit 0
2: stopped
3: exit 1
4: exit 0
Finished: 3, stopped: 1
```
