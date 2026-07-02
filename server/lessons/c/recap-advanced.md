Combine **preprocessor macros**, **file operations**, and **bitwise operators**

---

## Mission: Access control matrix

The computing center stores account access levels in a configuration file. You need a program that reads accounts from the operator, writes them to disk, reads them back, and decodes each account's permission flags using bitwise operations.

Do the following, in order:

1. Write **void print_permissions(const char \*name, int permissions)** — use bitwise **&** to check each flag and print the permissions that are set
2. Read **name permissions** pairs from input, one per line, until the end of input (use `while (scanf("%s %d", name, &permissions) == 2)`)
3. For each pair read, write it with **fprintf** into a file **"config.txt"**
4. After writing all the pairs, close the file, then open it again for **reading**
5. Read each pair back with **fscanf** and call **print_permissions** for each one, to decode the flags

The number **7** is **111** in binary (all permissions). **3** is **011** (read + write). **1** is **001** (read only)

**Example**

Input

```text
admin 7
editor 3
viewer 1
```

Output

```text
admin: READ WRITE EXECUTE
editor: READ WRITE
viewer: READ
```

**Example**

Input

```text
root 4
guest 2
ops 6
```

Output

```text
root: EXECUTE
guest: WRITE
ops: WRITE EXECUTE
```
