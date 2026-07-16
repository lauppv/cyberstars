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

A routine scan found a file called `mystery.dat` in your home directory. The extension is unfamiliar and nobody knows what it contains. Investigate it, then file it away properly.

1. Confirm that the basic listing tool (`ls`) is actually installed on this system.
2. Identify what kind of data is really inside `mystery.dat`.
3. It turns out to be plain readable text — display its contents to see the message.
4. Create a folder called `identified` and copy the file into it under the clearer name `readme.txt`.

**Expected result**

You see where `ls` lives, the inspection reveals `mystery.dat` is plain ASCII text despite its suspicious name, you read the message, and a copy sits in `identified/readme.txt` under a name that finally makes sense.
