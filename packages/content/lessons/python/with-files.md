It's easy to forget `.close()`, and if the program stops with an error before it, the file is never closed. The `with` block closes the file for us, always. It's how Python programmers open files

---

`with`, then `open(...)`, `as` and a name for the file. Inside the block we use the file. When the block ends, Python closes it

```py
with open("crew.txt", "w") as f:
    f.write("Ada\n")
    f.write("Alan\n")

with open("crew.txt") as f:
    print(f.read())
```

Output

```text
Ada
Alan

```

No `.close()` anywhere. The file is closed as soon as the indented lines are done

---

The file is closed even when something inside the block goes wrong. Here an error stops the block halfway, but what was written before it is saved

```py
try:
    with open("crew.txt", "w") as f:
        f.write("Ada\n")
        f.write(42)
except TypeError:
    print("could not write a number")

with open("crew.txt") as f:
    print(repr(f.read()))
```

Output

```text
could not write a number
'Ada\n'
```

`f.write(42)` fails, because `.write()` takes only strings. Python still closed the file on the way out, so `Ada` was saved

---

One `with` can open two files, with a comma between them. That's handy to read one file and write another at the same time

```py
with open("numbers.txt", "w") as f:
    f.write("4\n9\n16\n")

with open("numbers.txt") as source, open("roots.txt", "w") as target:
    for line in source.read().splitlines():
        target.write(f"{int(line) ** 0.5}\n")

with open("roots.txt") as f:
    print(f.read())
```

Output

```text
2.0
3.0
4.0

```

---

The file's name inside `with` only works while the file is open. After the block, writing to it fails, since the file is closed

```py
with open("crew.txt", "w") as f:
    f.write("Ada\n")

try:
    f.write("Alan\n")
except ValueError:
    print("the file is closed")
```

Output

```text
the file is closed
```

From now on, open files with `with`

---

## Mission: Radio Alerts

All radio messages go to one file. The crew wants a second file with only the messages that mention a certain word

1. Start your program with two variables: **messages**, a list of strings, and **word**, a string. For example `messages = ["dock clear", "fire in lab", "lab door open"]` and `word = "lab"`
2. With a `with` block, write the messages to `radio.txt`, one on each line
3. With one `with` block that opens both files, read `radio.txt` and write to `alerts.txt` only the messages that have the word in them, one on each line, in the same order
4. With a `with` block, read `alerts.txt` and print each line, numbered from 1, like `1. fire in lab`. Then print `Alerts: ` and how many there were

Use `with` for every file, and no `.close()`. **messages** has from 1 to 15 messages, all in small letters, and **word** is small letters too

**Example** for the values above

```text
1. fire in lab
2. lab door open
Alerts: 2
```
