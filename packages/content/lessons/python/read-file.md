Writing a file is half the story. Now we read one back: the whole text at once, or one line at a time, and we deal with a file that isn't there

---

`open()` with `"r"`, for read, or with no second value at all, opens a file for reading. `.read()` gives back everything in it as one string

```py
f = open("planets.txt", "w")
f.write("Mercury\nVenus\nEarth\n")
f.close()

f = open("planets.txt")
text = f.read()
f.close()
print(text.upper())
print(len(text))
```

Output

```text
MERCURY
VENUS
EARTH

20
```

Each lesson cell starts in an empty folder, so our cells first write the file they read

---

Once we have the text, all the string tools work on it. `.splitlines()` cuts it into a list of lines and leaves out the `\n` at their ends

```py
f = open("planets.txt", "w")
f.write("Mercury\nVenus\nEarth\n")
f.close()

f = open("planets.txt")
names = f.read().splitlines()
f.close()
print(names)
print(len(names), "planets")
```

Output

```text
['Mercury', 'Venus', 'Earth']
3 planets
```

`.split("\n")` would also cut it, but it gives one extra empty string at the end, after the last `\n`. `.splitlines()` doesn't

---

`.readline()` reads just the next line, with its `\n`. Each call goes on where the last one stopped. At the end of the file it gives an empty string

```py
f = open("planets.txt", "w")
f.write("Mercury\nVenus\n")
f.close()

f = open("planets.txt")
print(repr(f.readline()))
print(repr(f.readline()))
print(repr(f.readline()))
f.close()
```

Output

```text
'Mercury\n'
'Venus\n'
''
```

`repr()` shows a string the way we'd write it in code, so we can see the `\n`. `.strip()` takes it off, together with any spaces around the text

---

Opening a file that doesn't exist stops the program with a FileNotFoundError. We catch it with `try` and `except`, as in Try / Except

```py
try:
    f = open("missing.txt")
    print(f.read())
    f.close()
except FileNotFoundError:
    print("No such file, starting fresh")
```

Output

```text
No such file, starting fresh
```

---

## Mission: Stock Check

The station's store keeps its stock in a file, one item on each line, written as the item's name, a comma and how many there are. The old stock file from last year may still be around, or not

1. Start your program with a variable **stock**, a list of strings like `"rice,12"`. For example `stock = ["rice,12", "salt,3", "tea,40"]`
2. Write the strings to a file named `stock.txt`, one on each line
3. Read the file back with `.read()`, and use what you read to print `Items: ` and how many lines it has, `Total: ` and the counts of all the items added up, and `Most: ` and the item with the biggest count. If two items have the same biggest count, take the first
4. Try to read a file named `old.txt`. If it isn't there, print `old.txt: missing`. If it is, print `old.txt: ` and how many lines it has

**stock** has from 1 to 15 items, each with a count from 0 to 999. Item names are small letters only

**Example** for the stock above

```text
Items: 3
Total: 55
Most: tea
old.txt: missing
```
