`grep` searches _inside_ files for text. But sometimes you are looking for the **file
itself**: "where did I put that file called `report.txt`?". That is what **find**
does.

`find` walks through a directory tree and lists files that match what you describe.

The basic form is: `find WHERE-TO-LOOK CONDITIONS`.

### Find by name: `-name`

The most common condition is `-name`, to match files by their name:

```bash
find . -name report.txt
```

```text
./docs/report.txt
./archive/old/report.txt
```

`.` means "start from here". `find` searches that folder **and every sub-folder
inside it**, and prints the path of every match.

### Wildcards

The `*` symbol matches "any characters". Wrap the pattern in quotes so the shell does
not expand it first:

```bash
find . -name "*.log"
```

This finds every file ending in `.log`, anywhere in the tree.

### Where to search

You can point `find` at any folder, not just `.`:

```bash
find logs -name "error.txt"
```

`find` is your tool for "I know the name, not the location".

---

## Mission: Locate and Secure the Classified File

Intelligence reports that a classified document called `secret.txt` is stored somewhere under your home directory, but nobody remembers where.

1. Find where it is, searching by its name.
2. While you are at it, list every `.txt` file in the tree with one search.
3. Secure the classified file: copy it into a new `vault-copy` folder as `secret-backup.txt`.

**Expected result**

You know the path of `secret.txt`, you see every `.txt` file, and `vault-copy/secret-backup.txt` reads like the classified file.
