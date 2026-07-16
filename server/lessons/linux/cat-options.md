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

You already know `cat` can print several files in a row. That is its real super-power
— **concatenating** them:

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

The station's crew list got split into two files: `team-a.txt` and `team-b.txt`. Command needs a combined view, a numbered roll call, and both files kept together for the record.

1. Print `team-a.txt` and `team-b.txt` together in one go.
2. Print both files again, this time with a line number in front of every line, running continuously across both.
3. Create a folder called `roster` and copy both team files into it.
4. Confirm the archive by printing `roster/team-a.txt` with its lines numbered.

**Expected result**

Both teams appear one after another, then the same names with continuous line numbers. The `roster` folder holds a copy of each team file.
