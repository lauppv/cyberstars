Combine **preprocessor macros**, **file I/O**, and **bitwise operators**

---

## Mission: Access Control Matrix

The station's security system stores crew access levels in a config file. Rex needs a program that writes the access matrix to disk, reads it back, and decodes each crew member's permission flags using bitwise operations.

The data is already on the right. Do the following, in order:

1. Write **void printPermissions(const char \*name, int perms)** — uses bitwise **&** to check each flag and prints the set permissions
2. Create a file **"config.txt"** and write these 3 lines with **fprintf**:
   - admin 7
   - editor 3
   - viewer 1
3. Read the file back with **fscanf**
4. For each entry, call **printPermissions** to decode the flags

The number **7** is **111** in binary (all permissions). **3** is **011** (read + write). **1** is **001** (read only)

**Output**

```text
admin: READ WRITE EXECUTE
editor: READ WRITE
viewer: READ
```
