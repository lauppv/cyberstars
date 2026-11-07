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

A deep-space survey mission has been approved and the science team needs its project folder before they upload data. The last officer also left junk behind. When you are done, your home directory must look like this:

```text
.
├── project
│   ├── docs
│   │   └── readme.txt
│   └── src
│       └── main.sh
└── template.txt
```

`main.sh` is empty, and `readme.txt` is a copy of `template.txt`, word for word. Nothing else is left.

**Expected result**

Drawing your home directory as a tree shows exactly the plan above, and the readme reads like the template.
