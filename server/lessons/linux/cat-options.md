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

(In a later chapter you will learn how to *save* this joined output into a new file
using redirection. For now, just enjoy seeing it on screen.)

---

A crew list is split across two files. In your home directory:

1. Use `cat` to print `team-a.txt` and `team-b.txt` together, one after another.
2. Run `cat -n` on `team-a.txt` to see its lines numbered.
