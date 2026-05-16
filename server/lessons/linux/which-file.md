Two small but handy commands round off your searching skills: **which** and **file**.

### Where does a command live? `which`

When you type `ls`, Linux runs a program stored somewhere on disk. The **which**
command tells you *exactly where* that program is:

```bash
which ls
```

```text
/bin/ls
```

```bash
which grep
```

```text
/usr/bin/grep
```

This is useful when you want to know whether a command is installed at all — if
`which` prints nothing, the command was not found.

### What kind of file is this? `file`

A file's name does not always tell you what is inside it. The **file** command
**inspects the content** and reports the type:

```bash
file notes.txt
```

```text
notes.txt: ASCII text
```

```bash
file photo.png
```

```text
photo.png: PNG image data
```

`file` looks at the actual bytes, so it is right even when the extension is missing or
wrong.

| Command | Question it answers |
|---------|---------------------|
| `which` | "Where is this *program* installed?" |
| `file`  | "What *type* of file is this?" |

---

Investigate your environment:

1. Use `which` to find where the `ls` program is installed.
2. Use `file` to identify the type of `mystery.dat` in your home directory.
