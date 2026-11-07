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

A faint distress signal is coming from somewhere inside the `station` directory. Command needs you to trace it:

1. Locate the file called `distress.log`, wherever it sits in the `station` tree.
2. Find every line that mentions `SOS` in any file under `station`, with the file each one came from. Not every SOS is real: one is an old test signal.
3. Hand the real call to the rescue team: copy the log that holds the real SOS to `rescue/signal.log`.
4. The rescue team wants to run the same search on their own machine: show them where the program you searched the text with is installed.

**Expected result**

You know where `distress.log` is and which SOS is real, `rescue/signal.log` is a copy of the log with the real call, and you see the path of the search program.
