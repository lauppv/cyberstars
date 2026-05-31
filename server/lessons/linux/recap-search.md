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

## Mission: Rescue Signal Trace

A faint distress signal is coming from somewhere inside the `station` directory structure. Command needs you to pinpoint the source and extract every SOS transmission.

1. Use `find station -name "distress.log"` to locate the distress log file.
2. Use `grep -r "SOS" station` to find every line mentioning `SOS` anywhere inside `station`.
3. Use `which grep` to confirm where the `grep` program itself is installed.

**Expected result**

`find` reveals `station/comms/distress.log`. `grep -r` shows two SOS lines across two files in `station/comms/`. `which` prints the path to the `grep` binary. Rescue coordinates confirmed.
