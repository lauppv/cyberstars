You can create and move files — but how do you see _what is inside_ one? The simplest
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

`cat` is perfect for **short** files — a few lines you want to read in one glance. For
very long files it floods the screen; you will meet better tools (`head`, `tail`,
`less`) for those soon.

### Printing several files

Give `cat` more than one file and it prints them one after another, joined together:

```bash
cat part1.txt part2.txt
```

That "joining" is where the name _concatenate_ comes from.

Like `ls` and `pwd`, `cat` only reads — it never changes the file.

---

## Mission: Read and Archive the Briefing

A new briefing has arrived split across two files in your home directory: the main order in `briefing.txt` and an `addendum.txt` with last-minute details. Read them, then set aside a copy of the main briefing for the archive.

1. Display `briefing.txt` to see the main order.
2. Display **both** files joined together in a single command, so you have the full
   briefing at a glance.
3. Create a folder called `archive` and copy `briefing.txt` into it under the name
   `briefing-old.txt`.
4. Confirm the archive by displaying the contents of `archive/briefing-old.txt`.

**Expected result**

Both briefings appear in the terminal. The `archive` folder holds a faithful copy of the briefing, and displaying it shows exactly the same text as the original.
