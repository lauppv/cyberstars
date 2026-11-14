A local newspaper is putting forty years of articles online, and the editor wants numbers about all of it: how many words, how many letters, how often the town's name is there. With one processor this takes a long time. The server has several processors, so the work should be split: a few worker processes each count one part of the text at the same time, and send their numbers back to the main process, which adds them up. You will write it in C, with the tools the operating system gives you: `fork` and `pipe`.

**The input** starts with one line: how many workers to use (1 to 8) and the word to look for. Then comes the text, one line after another, until the input ends:

```text
3 the
The storm came on the third night.
Suddenly the lights of the town went out.
Only the lighthouse was still burning.
Out at sea, a small boat was turning back.
Raj ran down the stairs, two at a time.
The boat was close now; he heard voices.
A rope flew out of the dark.
He pulled until the boat scraped onto the sand.
```

**The output** for this input, when the program is finished:

```text
8 lines, 3 workers, looking for "the"
Worker 1, lines 1-2: 15 words, 60 letters, 4 "the"
Worker 2, lines 3-5: 24 words, 93 letters, 2 "the"
Worker 3, lines 6-8: 24 words, 90 letters, 4 "the"

Total: 8 lines, 63 words, 243 letters, 10 "the"
Counted alone: the same
```

Some words you will meet:

| Word    | What it means                                                  |
| ------- | -------------------------------------------------------------- |
| process | a program while it runs. Each process has its own memory       |
| parent  | the process that starts other processes. Here, the main one    |
| child   | a process started by the parent with `fork`. Here, each worker |
| pipe    | a way for one process to send bytes to another                 |
| zombie  | a child that has finished but that its parent never waited for |

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D), so the program knows the text has ended.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other texts. Passing them finishes the project. The tests also check that the work is really split: a program without `fork`, `pipe` and `waitpid` doesn't pass, whatever it prints.

## The job

Read the first line with `scanf`, and finish that line with `fgets`. Then read the text with `fgets` into an array of lines (at most 2000 lines of up to 500 characters each), and take the newline off the end of each line.

With more than 8 workers or fewer than 1, print `Use 1 to 8 workers` and stop. Otherwise print:

```text
8 lines, 3 workers, looking for "the"
```

Small and capital letters don't matter when you compare the word, so keep it in small letters.

## Count a slice

Before any processes, write the counting itself: a function that counts a range of lines and gives back a struct with four numbers: lines, words, letters, and how many words are the word you look for.

A word is letters one after the other (`isalpha`). Anything else separates words: `night.` is the word `night`, and `don't` is two words, `don` and `t`. Turn each word into small letters (`tolower`) before you compare it.

## One process per worker

Worker `k` (counted from 0) gets the lines from `k * n / w` up to `(k + 1) * n / w`, without that last one. Here `n` is the number of lines and `w` the number of workers. This cuts the text into parts that are as equal as whole lines allow.

`fork()` makes a copy of the running program. In the copy, the child, it gives back 0. In the original, the parent, it gives back the child's process id. Each child counts its part and ends with `_exit(0)`. Only the parent goes on with the rest of the program.

Be careful here: the parent printed its first line before `fork`, and `printf` keeps text in a buffer for a while before it writes it. A child that ends with `exit` would write its copy of that buffer again, and the line would come twice. `_exit` ends the child without writing any buffer.

## Send the numbers back

A child's variables are its own copy, so the parent can't see what the child counted. They talk through a **pipe**. `pipe(fds)` gives two file descriptors: `fds[1]` to write into and `fds[0]` to read from.

Make a pipe for each worker before you `fork` it. The child writes its struct with `write(fds[1], &c, sizeof c)`, and the parent reads it with `read(fds[0], &c, sizeof c)`. Each side closes the end it doesn't use.

## Wait for everyone

The children run at the same time, and they can finish in any order. The parent reads the workers' pipes in order, worker 1 first. After it reads a worker's numbers, it waits for that child with `waitpid`, so no finished child stays behind as a zombie.

Only the parent prints, and in the workers' order, so the report is always the same, whichever child finished first:

```text
Worker 1, lines 1-2: 15 words, 60 letters, 4 "the"
Worker 2, lines 3-5: 24 words, 93 letters, 2 "the"
Worker 3, lines 6-8: 24 words, 90 letters, 4 "the"
```

Lines are numbered from 1 here. A worker with no lines prints `Worker 4, no lines: 0 words, 0 letters, 0 "the"`.

## Check the teamwork

Print an empty line and the totals of all the workers. Then check them: the parent counts the whole text alone, with the same function, and compares:

```text
Total: 8 lines, 63 words, 243 letters, 10 "the"
Counted alone: the same
```

If the numbers were ever different, it would print `Counted alone: different!`. The editor ran it on forty years of articles.
