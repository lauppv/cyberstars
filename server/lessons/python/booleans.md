In the **if-else** lesson we briefly saw **True** and **False**. Time to look at them more carefully, because they are everywhere in programming

A **boolean** is a value that can only be one of two things: **True** or **False**. That’s it. No other options
```py
isOnline = True
hasKey = False
print(isOnline)
print(hasKey)
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
hasLicense = True

if age >= 18 and hasLicense == True:
    print("You can drive")
else:
    print("Sorry, no driving today")
```
The keyword **and** says: **both conditions must be True**. If even one of them is **False**, the whole thing is **False**

```py
age = 20
hasLicense = False

if age >= 18 and hasLicense == True:
    print("You can drive")
else:
    print("Sorry, no driving today")
```
Here **age >= 18** is **True**, but **hasLicense == True** is **False**. **True and False** = **False**, so we go to **else**

By the way, **hasLicense == True** is the same as just writing **hasLicense**, since **hasLicense** is already a boolean. So we can shorten it
```py
if age >= 18 and hasLicense:
    print("You can drive")
```
Cleaner :)

---

There is also **or**. Imagine: you can enter the club if you are **a VIP OR you have a special invitation**. Just **one** of them is enough

```py
isVIP = False
hasInvitation = True

if isVIP or hasInvitation:
    print("Welcome to the club")
else:
    print("Access denied")
```
Even though **isVIP** is **False**, **hasInvitation** is **True**, and that’s enough

And finally, **not**. **not** flips a boolean: **not True** becomes **False**, **not False** becomes **True**
```py
isLoggedIn = False
if not isLoggedIn:
    print("Please log in first")
```
Reads almost like English: *if not logged in, please log in*

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

You are writing the access system for **CyberStars HQ**. A person can enter if they are an **employee AND it’s a working day**, or if they are a **guest with an invitation**

You have these variables on the right:
```py
isEmployee
isWorkingDay
isGuest
hasInvitation
```

Display **Access granted** if the person can enter, **Access denied** otherwise

Play with the values, **run** multiple times and check that all combinations work :)
