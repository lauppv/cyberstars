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

Before starting repairs, you need a complete map of the station's file system and then to walk one of its branches to reach the reports archive.

1. See the full directory structure at a glance.
2. Using a relative path, move into `reports`, then confirm you landed in `/home/student/reports`.
3. From there, list the neighbouring `tools` folder without moving, using a relative path that steps back up one level.

**Expected result**

The tree map shows every file and folder, your position confirms you are inside `reports`, and the final listing reveals `deploy.sh` living over in `tools`.
