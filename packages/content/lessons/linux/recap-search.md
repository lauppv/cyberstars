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

1. Locate the file named `distress.log` somewhere inside the `station` directory tree.
2. Search every file under `station`, across the whole tree, for lines mentioning `SOS`.
3. Confirm where the `grep` program itself is installed on the system.

**Expected result**

The distress log turns out to be `station/comms/distress.log`. The recursive search shows two SOS lines across two files in `station/comms/`, and you see the path to the `grep` binary. Rescue coordinates confirmed.
