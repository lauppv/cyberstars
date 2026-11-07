A local newspaper is putting forty years of articles online, and the editor wants statistics on all of it: how many words, how many letters, how often the town's name comes up. On one processor that takes a while. The server has several, so the job should be split: a few worker processes each count a slice of the text at the same time, and send their numbers back to the boss process, which adds them up. You'll write it with the tools the operating system gives C: `fork` and `pipe`.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests count texts your program has never seen. Passing them finishes the project.

## The job

The first line is how many workers to use (1 to 8) and the word to look for; then comes the text, one line after another until the input ends:

```text
3 the
The storm came on the third night.
Suddenly the lights of the town went out.
Only the lighthouse was still burning.
```

Read the first line with `scanf`, finish its line with `fgets`, then read the text with `fgets` into an array of lines (at most 2000 of up to 500 characters), taking the newline off each. More workers than 8, or fewer than 1, prints `Use 1 to 8 workers` and stops. Otherwise:

```text
8 lines, 3 workers, looking for "the"
```

The word looked for is compared without caring about capitals, so keep it in small letters.

## Count a slice

Before any process, write the counting itself, as a function that counts a range of lines and returns a struct of four numbers: lines, words, letters, and how many words are the one looked for. A word is a run of letters (`isalpha`); everything else separates words, so `night.` is the word `night`, and `don't` is `don` and `t`. Turn each word into small letters (`tolower`) before comparing it.

## One process per worker

Worker `k` (counted from 0) gets the lines from `k * n / w` up to, but not including, `(k + 1) * n / w`, where `n` is the number of lines and `w` the number of workers. That splits the text into slices as even as whole lines allow.

`fork()` makes a copy of the running program: in the copy, the child, it returns 0; in the original, the parent, it returns the child's process id. Each child counts its slice and finishes with `_exit(0)`. Only the parent goes on with the rest of the program.

A trap: the parent printed its first line before forking, and `printf` keeps text in a buffer for a while before writing it out. A child that ends with `exit` would write the copy of that buffer again. `_exit` ends the child without emptying any buffer.

## Send the numbers back

A child's variables are its own copy: the parent can't see what it counted. They talk through a **pipe**: `pipe(fds)` gives two file descriptors, `fds[1]` to write into and `fds[0]` to read from. Make a pipe for each worker before forking it; the child writes its struct with `write(fds[1], &c, sizeof c)`, the parent reads it with `read(fds[0], &c, sizeof c)`. Each side closes the end it doesn't use.

## Wait for everyone

The children run at the same time, and finish in any order. The parent reads the workers' pipes in order, worker 1 first, and after reading each one waits for that child with `waitpid`, so no finished child is left behind as a zombie. Because only the parent prints, and in worker order, the report is the same however the children were scheduled:

```text
Worker 1, lines 1-2: 15 words, 60 letters, 4 "the"
Worker 2, lines 3-5: 24 words, 93 letters, 2 "the"
Worker 3, lines 6-8: 24 words, 90 letters, 4 "the"
```

Lines are numbered from 1 here. A worker whose slice is empty says `Worker 4, no lines: 0 words, 0 letters, 0 "the"`.

## Check the teamwork

After an empty line, the totals of all workers, and then the proof: the parent counts the whole text alone with the same function and compares.

```text
Total: 8 lines, 63 words, 243 letters, 10 "the"
Counted alone: the same
```

If the numbers ever differed, it would say `Counted alone: different!`. The tests also make sure the work really is shared: a program without `fork`, `pipe` and `waitpid` doesn't pass, whatever it prints. The editor ran it on forty years of articles.
