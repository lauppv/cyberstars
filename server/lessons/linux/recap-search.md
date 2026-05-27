Chapter 4 turned you into a station detective. Three search tools, three different
questions:

| Command | Question                               |
| ------- | -------------------------------------- |
| `grep`  | "Which **lines** contain this word?"   |
| `find`  | "Where is this **file**?"              |
| `which` | "Where is this **program** installed?" |

Remember the power options: `grep -r` searches whole trees, `grep -i` ignores case,
`grep -v` inverts; `find -name` matches names, `find -type` filters files vs folders.

---

A distress signal came from somewhere in the `station` folder. Track it down:

1. Use `find` with `-name` to locate the file called `distress.log` somewhere under
   `station`.
2. Use `grep -r` to find every line mentioning `SOS` anywhere inside the `station`
   folder.
3. Use `which` to confirm where the `grep` program itself lives.

Solve all three and the rescue is complete, cadet.
