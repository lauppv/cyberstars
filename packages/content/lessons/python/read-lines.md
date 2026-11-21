`.read()` loads the whole file at once. That's fine for small files, but a log can have millions of lines. A file opened for reading can also be used straight in a `for` loop, which gives it to us one line at a time

---

Each time around the loop, `line` holds the next line of the file, with its `\n` at the end. `.strip()` removes it

```py
with open("crew.txt", "w") as f:
    f.write("Ada\nAlan\nGrace\n")

with open("crew.txt") as f:
    for line in f:
        print(f"[{line.strip()}]")
```

Output

```text
[Ada]
[Alan]
[Grace]
```

Without `.strip()`, `print()` would add its own new line after the file's, and we'd get an empty line between the names

---

Python keeps only one line in memory at a time, so this works for a file of any size. And all we know about loops works here too: `enumerate()` to count lines, `continue` to skip some, `break` to stop early

```py
with open("crew.txt", "w") as f:
    f.write("# crew list\nAda\n\nAlan\n")

with open("crew.txt") as f:
    for number, line in enumerate(f, start=1):
        line = line.strip()
        if line == "" or line.startswith("#"):
            continue
        print(number, line)
```

Output

```text
2 Ada
4 Alan
```

Real files often have empty lines and comments. Skipping them early keeps the rest of the loop simple

---

`.readlines()` gives all the lines as a list, each with its `\n`. It's handy when we need the lines more than once, or need to know how many there are first

```py
with open("crew.txt", "w") as f:
    f.write("Ada\nAlan\nGrace\n")

with open("crew.txt") as f:
    lines = f.readlines()
print(lines)
print(lines[-1].strip())
```

Output

```text
['Ada\n', 'Alan\n', 'Grace\n']
Grace
```

---

A line often holds several values. Cut it with `.split()`, then turn the pieces into numbers where needed

```py
with open("scores.txt", "w") as f:
    f.write("Ada 12\nAlan 7\n")

total = 0
with open("scores.txt") as f:
    for line in f:
        name, points = line.split()
        total += int(points)
print(total)
```

Output

```text
19
```

---

## Mission: Temperature Log

A sensor writes the temperature to a file every hour. The file also has notes that start with `#`, and some empty lines. The engineers want a summary of the real readings

1. Start your program with a variable **lines**, a list of strings: the lines of the log. A reading is a time and a whole number, like `"08:00 21"`. For example `lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]`
2. Write the lines to `temps.txt`, one on each line
3. Read `temps.txt` line by line, with a `for` loop over the file. Skip the empty lines and the notes
4. Print `Readings: ` and how many readings there are, then `Lowest: `, `Highest: ` and `Average: ` and the lowest, the highest and the average temperature. The average has 1 decimal. If there are no readings, print only `Readings: 0`

**lines** has from 1 to 24 lines. Temperatures are from -40 to 50

**Example** for the lines above

```text
Readings: 3
Lowest: 19
Highest: 25
Average: 21.7
```
