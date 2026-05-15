Combine **preprocessor macros**, **file I/O**, and **bitwise operators**

---

Build a **config file reader** with permission flags. Here's the setup:

Define these macros:
```c
#define PERM_READ    (1 << 0)   // 001
#define PERM_WRITE   (1 << 1)   // 010
#define PERM_EXECUTE (1 << 2)   // 100
```

Write a function **void printPermissions(const char \*name, int perms)** that uses bitwise **&** to check each permission flag and prints which ones are set

Write a program that:
1. Creates a file **"config.txt"** and writes these 3 lines (name followed by permission number):
```text
admin 7
editor 3
viewer 1
```
2. Reads the file back with **fscanf**
3. For each user, prints their permissions using **printPermissions**

The number **7** is **111** in binary (all permissions). **3** is **011** (read + write). **1** is **001** (read only)

Expected output
```text
admin: READ WRITE EXECUTE
editor: READ WRITE
viewer: READ
```

Use **#define** for the macros, **fprintf/fscanf** for file I/O, and **&** to test each bit
