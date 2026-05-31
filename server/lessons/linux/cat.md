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

## Mission: Read the Briefing

A new mission briefing has arrived and is stored in `briefing.txt` in your home directory. Read it to find out what the crew's next objective is.

Use `cat` to display the contents of `briefing.txt`.

**Expected result**

The full text of the briefing appears in your terminal.
