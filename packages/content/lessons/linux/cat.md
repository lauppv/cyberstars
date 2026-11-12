You can create and move files, but how do you see _what is inside_ one? The simplest
tool is **cat**.

The name is short for **concatenate**, but its everyday use is plain: **print a file's
contents to the screen**.

```bash
cat mission.txt
```

```text
Mission: explore sector 7.
Status: in progress.
```

The whole file is dumped into the terminal at once.

### When to use cat

`cat` is perfect for short files: a few lines you want to read in one glance. For
very long files it floods the screen; you will meet better tools (`head`, `tail`,
`less`) for those soon.

### Printing several files

Give `cat` more than one file and it prints them one after another, joined together:

```bash
cat part1.txt part2.txt
```

That "joining" is where the name _concatenate_ comes from.

Like `ls` and `pwd`, `cat` only reads. It never changes the file.

---

## Mission: Read and Archive the Briefing

A new briefing has arrived in two parts: the main order in `briefing.txt` and the last-minute details in `addendum.txt`. Read the whole briefing as one text, both parts in a single command, then keep the main order for the record as `archive/briefing-old.txt`.

**Expected result**

You have read both parts one after the other, and the archived copy reads exactly like the main order.
