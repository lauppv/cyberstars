pipe, dup2, fork, exec and read working together: a parent that catches another program's output and does something with it

---

## Mission: The Relay Station

The relay station runs programs for the operators and checks what they print, without showing it. For every program, it reports how many lines it printed, the sum of the whole numbers among those lines, and how it ended

1. Read commands, one per line, until the input ends. Each one is a program and its arguments, separated by spaces
2. For each command, make a pipe and fork. The child points its stdout to the pipe with dup2 and runs the program with execvp. If exec fails, it exits with 127
3. The parent closes the write end, then reads everything from the pipe with read until it returns 0, and waits for the child
4. In what the program printed, count the lines, and add up every line that is a whole number, checked with strtol. Lines that are not numbers count as lines but add nothing
5. Print the command and the results, as in the example

Call fflush(stdout) before every fork. A program prints at most 60000 bytes. Commands have at most 100 characters and 8 words

**Example**

Input

```text
seq 4
echo tape 7
expr 6 * 7
nosuchcmd
```

Output

```text
seq 4 -> lines 4, sum 10, exit 0
echo tape 7 -> lines 1, sum 0, exit 0
expr 6 * 7 -> lines 1, sum 42, exit 0
nosuchcmd -> lines 0, sum 0, exit 127
```

"tape 7" is not a whole number, so it adds nothing. Splitting the line with strtok changes it, so keep a copy of the command to print
