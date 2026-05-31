So far you have only _looked_ at directories. Now you will **move between them**.

The **cd** command (**change directory**) takes you into a different folder. After
`cd`, your _current working directory_ changes — and `pwd` will prove it.

### Going into a folder

Give `cd` the name of a folder that exists where you are:

```bash
cd reports
pwd
```

```text
/home/student/reports
```

You have moved **down** into `reports`.

### Going back up: `..`

The special name `..` means **the parent directory** — one level up. To leave
`reports` and return to `/home/student`:

```bash
cd ..
pwd
```

```text
/home/student
```

### Useful shortcuts

| Command | Where it takes you                                            |
| ------- | ------------------------------------------------------------- |
| `cd ~`  | your **home** directory (`/home/student`)                     |
| `cd /`  | the **root** of the whole system                              |
| `cd ..` | one directory **up**                                          |
| `cd`    | also home — typing `cd` with nothing is a shortcut for `cd ~` |

### Paths

You can also jump several levels at once by giving a full **path**:

```bash
cd /home/student/reports
```

A path starting with `/` is **absolute** — it works no matter where you currently are.
A path without a leading `/` (like `reports`) is **relative** — it is read starting
from your current location.

Tip: lost? `cd ~` always brings you home, and `pwd` always tells you where you are.

---

## Mission: Reach the Scripts Vault

A critical automation script is stored deep inside the station's file system. Your home directory contains a `tools` folder, and inside it there is a `scripts` folder.

1. Navigate into the `tools` folder.
2. From there, navigate into the `scripts` folder.

**Expected result**

Running `pwd` shows `/home/student/tools/scripts` — you have reached the vault.
