As folders gain sub-folders, it gets hard to picture the whole structure. The
**tree** command draws it for you as a neat diagram.

```bash
tree
```

```text
.
├── mission.txt
├── reports
│   ├── january.log
│   └── february.log
└── tools
    └── deploy.sh

2 directories, 4 files
```

The indentation and lines show what is inside what. It is a read-only command — like
`ls`, it never changes anything.

### Absolute vs relative paths

A **path** is the address of a file or folder. There are two kinds.

An **absolute path** starts at the root `/` and spells out every step:

```text
/home/student/reports/january.log
```

It works from **anywhere** — it is the full address.

A **relative path** starts from _wherever you currently are_. If you are in
`/home/student`, then:

```text
reports/january.log
```

points to the same file. No leading `/` means "start from here".

Two special names help with relative paths:

- `.` — the current directory
- `..` — the parent directory (one level up)

So `../tools/deploy.sh` means "go up one level, then into `tools`".

Use `pwd` to see your absolute location, and `tree` to see the structure below you.

---

## Mission: Map the Station

Before starting repairs, you need a complete map of the station's file system layout and confirmation of your current position.

1. Run `tree` to see the full directory structure at a glance.
2. Run `pwd` to confirm your absolute path.

**Expected result**

You see a tree diagram showing all files and folders in your home directory, and `pwd` confirms you are at `/home/student`.
