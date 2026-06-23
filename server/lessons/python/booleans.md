In the **if-else** lesson we briefly saw **True** and **False**, and in the loops we even used **while True**. Time to look at them more carefully, because they are everywhere in programming

A **boolean** is a value that can only be one of two things: **True** or **False**. That's it. No other options

```py
is_online = True
has_key = False
print(is_online)
print(has_key)
```

**Be careful**: **True** and **False** are written **with a capital letter**. **true** and **false** will give an error in Python

We already know that conditions like **age < 18** or **x == 5** are checked by **if**. Well, those conditions are actually **booleans** in disguise

```py
age = 20
print(age < 18)     # False
print(age >= 18)    # True
```

Try it. **Python** literally prints **True** or **False**

---

So far so good. But what if we want to combine multiple conditions? Imagine a story: in order to drive a car, you need to be **at least 18 years old AND have a license**. Both must be true at the same time

```py
age = 20
has_license = True

if age >= 18 and has_license == True:
    print("You can drive")
else:
    print("You must be at least 18 and have a license to drive")
```

The keyword **and** says: **both conditions must be True**. If even one of them is **False**, the whole thing is **False**

In other words, if we have `left` **and** `right`, both `left` and `right` must be **True** for the whole expression to be **True**

```py
age = 20
has_license = False

if age >= 18 and has_license == True:
    print("You can drive")
else:
    print("You must be at least 18 and have a license to drive")
```

Here **age >= 18** is **True**, but **has_license == True** is **False**. **True and False** = **False**, so we go to **else**

By the way, **has_license == True** is the same as just writing **has_license**, since **has_license** is already a boolean. So we can shorten it

```py
if age >= 18 and has_license:
    print("You can drive")
```

Programmers often prefer to drop the **== True** because **if has_license** already means **if has_license == True**. You can write it either way, both are equally correct

---

There is also **or**. Imagine: you can enter the club if you are **a VIP OR you have a special invitation**. Just **one** of them is enough

```py
is_vip = False
has_invitation = True

if is_vip or has_invitation:
    print("Welcome to the club")
else:
    print("Access denied")
```

Even though **is_vip** is **False**, **has_invitation** is **True**, and that's enough

And finally, **not**. **not** flips a boolean: **not True** becomes **False**, **not False** becomes **True**

```py
is_logged_in = False
if not is_logged_in:
    print("Please log in first")
```

Reads almost like English: _if not logged in, please log in_

---

Quick summary, the **truth tables**

```text
True  and True  = True
True  and False = False
False and True  = False
False and False = False

True  or  True  = True
True  or  False = True
False or  True  = True
False or  False = False

not True  = False
not False = True
```

---

## Booleans in loops

We've already seen a boolean as a condition: **while True** runs as long as the condition is... **True**. But we can also use a boolean **stored in a variable** to control a loop. Such a variable is often called a **flag**

```py
running = True
number = 0
while running:
    print(number)
    number = number + 1
    if number == 3:
        running = False
print("Done")
```

Output

```text
0
1
2
Done
```

As long as **running** is **True**, the loop continues. When the **if** makes it **False**, the condition **while running** becomes false and the loop stops at the next check. It's a clean alternative to **break** — instead of jumping out abruptly, we let the condition close itself

---

## Mission: Command Console

The station has a console that runs **as long as** it's powered on. Use a boolean variable `powered_on` (starts as `True`) as the condition for a **while** loop. On every step, read a command with `input()`:

- if the user types `shutdown` → set `powered_on` to `False` (the loop will stop here)
- if the user types `status` → print `System active`
- otherwise → print `Unknown command`

After the loop ends, print `Closing console...`.

**Example**

If the user types `status`, then `hello`, then `shutdown` in turn, the program prints

```text
System active
Unknown command
Closing console...
```
