In Try / Except we met `try` and `except`. A `try` can have two more blocks: `else`, for the code that should run only when nothing went wrong, and `finally`, for the code that must run no matter what

---

`else` comes after the `except` blocks. It runs only when the `try` block finished without an error

```py
for text in ["42", "abc"]:
    try:
        number = int(text)
    except ValueError:
        print(text, "is not a number")
    else:
        print(text, "doubled is", number * 2)
```

Output

```text
42 doubled is 84
abc is not a number
```

Why not put the doubling inside `try`? Then an error in the doubling would be caught too, as if it were a bad number. With `else`, `try` holds only the line we expect to fail, so we catch only that error

---

`finally` comes last. It runs every time: after a success, after a caught error, and even when an error is not caught at all

```py
def read_number(text):
    try:
        return int(text)
    except ValueError:
        return 0
    finally:
        print("checked", text)

print(read_number("7"))
print(read_number("x"))
```

Output

```text
checked 7
7
checked x
0
```

`finally` runs even though the function returns from `try` or `except`: Python runs it on the way out, before the value goes back

---

That makes `finally` the place for cleanup: closing something, turning something off, writing that a job ended

```py
lights_on = False
try:
    lights_on = True
    print("working in the dark room")
    int("oops")
except ValueError:
    print("something went wrong")
finally:
    lights_on = False
    print("lights off")
print(lights_on)
```

Output

```text
working in the dark room
something went wrong
lights off
False
```

A `with` block, which we met with files, does this kind of cleanup for us. `finally` is for the cases where there is no `with`

---

All four together, in this order: `try`, `except`, `else`, `finally`

```py
for text in ["5", "five"]:
    try:
        value = int(text)
    except ValueError:
        print("bad:", text)
    else:
        print("good:", value)
    finally:
        print("next")
```

Output

```text
good: 5
next
bad: five
next
```

---

## Mission: Sensor Import

Readings come from the sensors as text. Some are broken. The station imports them one by one, and after each one, good or bad, it notes that the text was checked

1. Write a function **import_reading(text, readings, checked)** with a `try` that only turns the text into a whole number. On a `ValueError`, it prints `skipped` and the text as `repr()` shows it, in quotes. In `else`, it adds the number to the list `readings` and prints `saved` and the number. In `finally`, it adds the text to the list `checked`, every time
2. Start your program with a variable **texts**, a list of strings. For example `texts = ["21", "x7", "-3", ""]`
3. Make two empty lists and call `import_reading()` for each text
4. Print `Saved: ` and the list of readings, and `Checked: ` and how many texts were checked

**texts** has from 1 to 10 texts. A good text is a whole number, maybe with a `-`

**Example** for the values above

```text
saved 21
skipped 'x7'
saved -3
skipped ''
Saved: [21, -3]
Checked: 4
```
