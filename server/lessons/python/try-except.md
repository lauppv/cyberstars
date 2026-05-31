Sometimes things go wrong. The user types a word when we expect a number. We try to access a list index that doesn't exist. We divide by zero. These things are called **errors** or **exceptions**, and they **crash** the program

```py
number = int("abc")
```

**Run** it. **ValueError**. Python can't convert "abc" to a number

```py
names = ["Tommy", "Lance"]
print(names[10])
```

**Run** it. **IndexError**. There's no element at position 10

```py
print(10 / 0)
```

**Run** it. **ZeroDivisionError**. Math says no :)

---

Until now, when an error happened, the program crashed and that was it. But in a real program, we don't want a crash. We want to **handle** the error gracefully and keep going

This is where **try** and **except** come in

```py
try:
    number = int("abc")
    print(number)
except:
    print("That's not a valid number")
```

Output **That's not a valid number**

How it works: Python **tries** to run the code inside the **try** block. If everything goes well, it continues normally. If an error happens, instead of crashing, Python jumps to the **except** block and runs that code instead

```py
try:
    age = int(input("Your age: "))
    print(f"Next year you'll be {age + 1}")
except:
    print("Please enter a number, not text!")
```

If the user types **18**, everything works. If they type **hello**, we get a friendly message instead of a crash

---

We can be **specific** about which error we want to catch

```py
try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(result)
except ValueError:
    print("That's not a number!")
except ZeroDivisionError:
    print("Can't divide by zero!")
```

If the user types text → **ValueError** is caught. If they type **0** → **ZeroDivisionError** is caught. Each error gets its own message. This is better than a generic **except** because we know exactly what went wrong

---

A common pattern: keep asking until the user gives valid input

```py
while True:
    try:
        age = int(input("Your age: "))
        break
    except ValueError:
        print("That's not a number, try again")

print(f"Your age is {age}")
```

The **while True** loop keeps running. If **int()** succeeds, we **break** out of the loop. If it fails, we print a message and the loop continues. This is a pattern you'll use a lot

---

We can also use **else** (runs only if no error occurred) and **finally** (runs no matter what)

```py
try:
    number = int("42")
except ValueError:
    print("Error!")
else:
    print("No errors, great!")
finally:
    print("This always runs")
```

Output

```text
No errors, great!
This always runs
```

**else** and **finally** are optional. For now, **try** and **except** are the important ones

---

## Mission: Sensor Cleanup

The station receives a list of sensor readings as **strings**, but some are corrupted — they aren't numbers at all (already on the right). Go through the list and, using **try/except**, turn each one into an integer:

- if it converts, add it to a running **total**
- if `int()` raises a `ValueError`, count it as **corrupted** and move on (no crash)

At the end, print:

- `Total: ` then the sum of the valid readings
- `Corrupted: ` then how many readings failed

**Output**

```text
Total: 162
Corrupted: 2
```

The valid readings are `42`, `100`, `7`, and `13` (sum `162`); `x9` and `bad` are the two corrupted ones.
