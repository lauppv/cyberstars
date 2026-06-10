In the **if-else** lesson we briefly saw **True** and **False**. Time to look at them more carefully, because they are everywhere in programming

A **boolean** is a value that can only be one of two things: **True** or **False**. That’s it. No other options

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
    print("Sorry, no driving today")
```

The keyword **and** says: **both conditions must be True**. If even one of them is **False**, the whole thing is **False**

```py
age = 20
has_license = False

if age >= 18 and has_license == True:
    print("You can drive")
else:
    print("Sorry, no driving today")
```

Here **age >= 18** is **True**, but **has_license == True** is **False**. **True and False** = **False**, so we go to **else**

By the way, **has_license == True** is the same as just writing **has_license**, since **has_license** is already a boolean. So we can shorten it

```py
if age >= 18 and has_license:
    print("You can drive")
```

Cleaner :)

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

Even though **is_vip** is **False**, **has_invitation** is **True**, and that’s enough

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

## Mission: HQ Access

You are writing the door system for **CyberStars HQ**. A person can enter if they are an **employee AND it's a working day**, or if they are a **guest who has an invitation**.

The program asks **four** questions. For each one the user types `yes` or `no`. A handy trick: `answer == "yes"` is already a boolean, so you can store it straight into a variable.

**Input** (typed by the user when the program runs), each one `yes` or `no`:

- is the person an employee?
- is it a working day?
- is the person a guest?
- does the person have an invitation?

**Output**

One line: `Access granted` if the person can enter, otherwise `Access denied`.

**Example**

If the user types

```text
yes
yes
no
no
```

the program should print

```text
Access granted
```

A guest with an invitation also gets in. If the user types

```text
no
no
yes
yes
```

the program should print

```text
Access granted
```
