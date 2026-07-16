`grep` searches _inside_ files for text. But sometimes you are looking for the **file
itself** — "where did I put that file called `report.txt`?". That is what **find**
does.

`find` walks through a directory tree and lists files that match what you describe.

The basic form is: `find WHERE-TO-LOOK CONDITIONS`.

### Find by name: `-name`

The most common condition is `-name` — match files by their name:

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

Intelligence reports that a classified document called `secret.txt` is stored somewhere in your home directory tree, but no one remembers the exact path. Once located, it must be secured.

1. Search the whole tree for the file named `secret.txt` and print its full path.
2. Search the tree again for every file ending in `.log`, using a wildcard.
3. Now that you know where it lives, create a folder called `vault-copy` and copy the classified file `data/vault/secret.txt` into it as `secret-backup.txt`.

**Expected result**

The path to `secret.txt` appears, then the `.log` files, and the `vault-copy` folder holds a secured backup of the classified file.
