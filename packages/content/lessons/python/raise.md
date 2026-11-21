In Try / Except we caught the errors Python raises, like a ValueError from `int("abc")`. Our own code can raise errors too, with `raise`. A function raises one when it gets something it can't work with, instead of going on and giving a wrong answer

---

`raise`, then an error with a message. The program stops right there, like with any error, unless someone catches it

```py
def set_speed(speed):
    if speed < 0:
        raise ValueError("speed can't be negative")
    print("speed set to", speed)

set_speed(12)
set_speed(-5)
print("this line never runs")
```

Run it: the first call works, the second one stops the program with `ValueError: speed can't be negative`, our own message

---

The code that calls the function decides what to do with the error. It catches it with `try` and `except`, as with Python's own errors. `as e` gives us the error, and `str(e)` its message

```py
def set_speed(speed):
    if speed < 0:
        raise ValueError("speed can't be negative")
    return speed

for value in [12, -5, 30]:
    try:
        print("set", set_speed(value))
    except ValueError as e:
        print("refused:", e)
```

Output

```text
set 12
refused: speed can't be negative
set 30
```

The function only says what's wrong. It doesn't print, and it doesn't decide what happens next: that's the caller's job

---

Pick the error that fits. `ValueError` is for a value of the right kind but a bad one, like a negative speed. `TypeError` is for a value of the wrong kind, like a word where a number should be

```py
def set_speed(speed):
    if not isinstance(speed, int):
        raise TypeError("speed must be a whole number")
    if speed < 0:
        raise ValueError("speed can't be negative")
    return speed

try:
    set_speed("fast")
except TypeError as e:
    print(e)
```

Output

```text
speed must be a whole number
```

---

Inside an `except` block, a bare `raise` raises the same error again. That's for when we want to note something, but still let the error go on

```py
try:
    try:
        int("abc")
    except ValueError:
        print("noted the bad number")
        raise
except ValueError as e:
    print("outside:", e)
```

Output

```text
noted the bad number
outside: invalid literal for int() with base 10: 'abc'
```

---

## Mission: Door Codes

Crew members choose a code for their cabin door. The computer refuses a code that is too easy to guess, and says why

1. Write a function **check_code(code)** that raises a `ValueError` when the code is bad, with one of these messages, checked in this order: `too short` when it has fewer than 4 characters, `digits only` when it has anything but digits, `all the same` when every digit is the same, `in a row` when the digits go up by one each, like `1234`. When the code is good, it returns the code
2. Start your program with a variable **codes**, a list of strings. For example `codes = ["12", "4a21", "7777", "3456", "9071"]`
3. For each code, call `check_code()` and print the code, `: ` and `ok`, or the error's message when it raises one

Every code has from 0 to 8 characters

**Example** for the codes above

```text
12: too short
4a21: digits only
7777: all the same
3456: in a row
9071: ok
```
