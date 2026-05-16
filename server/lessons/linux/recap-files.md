Chapter 2 gave you the full file-management toolkit. Time to use all of it in one
build.

| Command | Job |
|---------|-----|
| `mkdir` (`-p`) | create folders |
| `touch` | create empty files |
| `cp` (`-r`) | copy files and folders |
| `mv` | move and rename |
| `rm` (`-r`), `rmdir` | delete files and folders |

A project folder almost always starts the same way: make the directories, then put
files into them. Plan the structure first, then build it step by step. Use `ls` and
`tree` between steps to check your work.

---

Build a project folder for a new mission. Starting in your home directory:

1. Create a folder called `project`.
2. Inside it, create two sub-folders in one command: use `mkdir -p` to make
   `project/src` and `project/docs`.
3. Inside `project/src`, create an empty file called `main.sh`.
4. Copy the existing `template.txt` file into `project/docs` and rename the copy to
   `readme.txt` (so it becomes `project/docs/readme.txt`).
5. Delete the leftover `junk.txt` file from your home directory.

When you finish, the structure under `project` should be in place, `readme.txt` should
contain the template text, and `junk.txt` should be gone.
