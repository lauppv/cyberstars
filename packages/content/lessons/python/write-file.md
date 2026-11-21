Everything our programs know disappears when they end. To keep something for later, a log, a list of scores, settings, we write it to a **file**

---

`open()` opens a file and gives us an object to work with. Its second value says what we want to do: `"w"` means write. Then `.write()` puts text into the file, and `.close()` saves it and lets it go

```py
log = open("log.txt", "w")
log.write("Engine started\n")
log.write("All systems fine\n")
log.close()

print(open("log.txt").read())
```

Output

```text
Engine started
All systems fine

```

The last line only peeks into the file, to show what's inside. We see how reading works in the next lesson

`.write()` doesn't add a new line by itself, unlike `print()`. That's why each line ends with `"\n"`, the character that means "a new line starts here"

---

`"w"` makes a new, empty file, or **erases** the old one if a file with that name is already there. Run this cell: only the second text is left

```py
f = open("note.txt", "w")
f.write("first\n")
f.close()

f = open("note.txt", "w")
f.write("second\n")
f.close()

print(open("note.txt").read())
```

Output

```text
second

```

---

To add to the end of a file and keep what's there, open it with `"a"`, for append

```py
f = open("note.txt", "w")
f.write("first\n")
f.close()

f = open("note.txt", "a")
f.write("second\n")
f.close()

print(open("note.txt").read())
```

Output

```text
first
second

```

---

`.write()` takes only strings. A number has to become a string first, with `str()` or inside an f-string

```py
scores = [12, 7, 30]
f = open("scores.txt", "w")
for score in scores:
    f.write(f"{score}\n")
f.close()

print(open("scores.txt").read())
```

Output

```text
12
7
30

```

Always close the file. Until then, part of what we wrote may still wait in memory, not yet saved

---

## Mission: Shift Log

At the end of each shift, the crew writes what happened to a log file, so the next shift can read it

1. Start your program with two variables: **title**, a string, and **entries**, a list of strings. For example `title = "night shift"` and `entries = ["checked air", "fixed door"]`
2. Write a file named `log.txt`: the first line is the title in capitals, then one line for each entry, numbered from 1, like `1. checked air`
3. Open the file again to add one more line at its end: `END`. Every line of the file ends with a new line, the last one too
4. Read the whole file and print it, then print `Characters: ` and how many characters the file has, new lines included

**entries** has from 0 to 10 entries

**Example** for the values above

```text
NIGHT SHIFT
1. checked air
2. fixed door
END

Characters: 45
```

The empty line comes from printing the file's text, which already ends with a new line, and `print()` adds one more
