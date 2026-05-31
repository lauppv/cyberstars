Two small but handy commands round off your searching skills: **which** and **file**.

### Where does a command live? `which`

When you type `ls`, Linux runs a program stored somewhere on disk. The **which**
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

| Command | Question it answers                  |
| ------- | ------------------------------------ |
| `which` | "Where is this _program_ installed?" |
| `file`  | "What _type_ of file is this?"       |

---

## Mission: Unknown Data Probe

A routine scan found a file called `mystery.dat` in your home directory. The extension is unfamiliar and nobody knows what it contains. Before opening it, you need to investigate.

1. Use `which ls` to confirm that basic tools are available on this system.
2. Use `file mystery.dat` to identify what kind of data is actually inside.

**Expected result**

You see the path where `ls` is installed, and `file` reveals that `mystery.dat` is plain ASCII text despite its suspicious name.
