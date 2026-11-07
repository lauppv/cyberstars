`cat` has a couple of handy options that make reading files easier.

### Numbering lines: `cat -n`

The `-n` option puts a **line number** in front of every line:

```bash
cat -n crew.txt
```

```text
     1	Ava
     2	Ben
     3	Chloe
```

This is great when you need to refer to "line 12" of a file, or count how far down
something is.

### Joining files

You already know `cat` can print several files in a row. That is its real super-power,
**concatenating** them:

```bash
cat header.txt body.txt footer.txt
```

The three files are printed one after another, top to bottom, as if they were a single
document. Combine this with numbering:

```bash
cat -n part1.txt part2.txt
```

The numbering runs continuously across both files.

(In a later chapter you will learn how to _save_ this joined output into a new file
using redirection. For now, just enjoy seeing it on screen.)

---

## Mission: Assemble and Archive the Crew Roster

The crew list got split into `team-a.txt` and `team-b.txt`. Command wants a roll call: every name of both teams in one list, each with its number, counting on from team A into team B rather than starting again. They also want both files kept together in a new `roster` folder.

**Expected result**

You see one numbered list whose numbers run on from the first team into the second, and `roster` holds a copy of each team file.
