Chapter 2 gave you the full file-management toolkit. Time to use all of it in one
build.

| Command              | Job                      |
| -------------------- | ------------------------ |
| `mkdir` (`-p`)       | create folders           |
| `touch`              | create empty files       |
| `cp` (`-r`)          | copy files and folders   |
| `mv`                 | move and rename          |
| `rm` (`-r`), `rmdir` | delete files and folders |

A project folder almost always starts the same way: make the directories, then put
files into them. Plan the structure first, then build it step by step. Use `ls` and
`tree` between steps to check your work.

---

## Mission: New Mission Scaffold

A new deep-space survey mission has been approved and needs a proper project directory before the science team can start uploading data. You also need to clean up leftover junk from the last officer's shift.

1. Create a folder called `project`.
2. Inside it, create two sub-folders in one command: `mkdir -p project/src project/docs`.
3. Inside `project/src`, create an empty file called `main.sh`.
4. Copy the existing `template.txt` into `project/docs/readme.txt`.
5. Delete the leftover `junk.txt` from your home directory.

**Expected result**

Running `ls project/src` shows `main.sh`. Running `cat project/docs/readme.txt` shows the template text. The file `junk.txt` no longer exists in your home directory.
