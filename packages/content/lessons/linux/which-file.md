Two small but handy commands round off your searching skills: **which** and **file**.

### Where does a command live? `which`

When you type `ls`, Linux runs a program stored somewhere on disk. The which
command tells you _exactly where_ that program is:

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

This is useful when you want to know whether a command is installed at all: if
`which` prints nothing, the command was not found.

### What kind of file is this? `file`

A file's name does not always tell you what is inside it. The file command
inspects the content and reports the type:

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

| Command | Question it answers                  |
| ------- | ------------------------------------ |
| `which` | "Where is this _program_ installed?" |
| `file`  | "What _type_ of file is this?"       |

---

## Mission: Unknown Data Probe

A routine scan found `mystery.dat` in your home directory. Nobody knows what it holds, and its name says nothing.

1. Before you trust the tools, find where the program that counts lines is installed.
2. Find out what kind of data `mystery.dat` really holds, without opening it.
3. If it turns out to be readable, read it.
4. File it under a name that makes sense: a copy in a new `identified` folder as `readme.txt`.

**Expected result**

You see where the line counter lives, what kind of file `mystery.dat` is and its message, and `identified/readme.txt` is a copy of it.
