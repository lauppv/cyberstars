A **string** is more than just a piece of text we display. **Python** offers us many tools to inspect and modify strings, and we’re going to look at the most useful ones

---

How long is a name? How many letters does it have? **len()** tells us

```py
name = "Tommy Vercetti"
print(len(name))
```

Output **14**. Yes, the **space** counts too. Every character matters, including spaces, commas, dots, exclamation marks. Try with **len("Lance Vance Dance")** :)

---

We can transform a string to **uppercase** or **lowercase**

```py
name = "tommy vercetti"
print(name.upper())   # TOMMY VERCETTI
print(name.lower())   # tommy vercetti
```

Notice the **dot** between **name** and **upper()**. The **dot syntax** means: "take this string and apply this method to it". A **method** is just a function that belongs to something, in this case to a string

**Important**: **name.upper()** does **NOT change** the original variable. It returns a **new** string

```py
name = "tommy vercetti"
name.upper()
print(name)
```

Will print **tommy vercetti**, lowercase as before, because we did **nothing** with the result of **name.upper()**. To actually keep it uppercase

```py
name = "tommy vercetti"
name = name.upper()
print(name)
```

Now **name** stores the new value. This kind of trap catches absolutely everyone in the beginning, so don’t worry if it confuses you :)

---

We can **glue strings together** with **+**. This is called **concatenation**

```py
firstName = "Tommy"
lastName = "Vercetti"
fullName = firstName + " " + lastName
print(fullName)
```

Output **Tommy Vercetti**. Notice that we added **" "** in the middle, otherwise we’d get **TommyVercetti** glued together. Strings don’t add spaces for us, we have to do it ourselves

By the way, you’ve already seen a much nicer way to combine strings with **f-strings** from a previous lesson. Both work, but **f-strings** are usually easier to read

---

The most powerful trick: **slicing**. We can grab a piece of a string by giving its **start** and **end** position

```py
name = "Tommy Vercetti"
print(name[0])      # T
print(name[1])      # o
print(name[0:5])    # Tommy
print(name[6:14])   # Vercetti
```

**Important**: in programming, counting starts from **0**, **NOT** from **1**. So **name[0]** is the **first** letter, **name[1]** is the second, and so on

**name[0:5]** means "from position **0**, up to but **NOT including** position **5**". So we take positions **0, 1, 2, 3, 4**, which spell **Tommy**. Just like with **range()** in the **for** loop, the end is exclusive

We can also leave one of the numbers out

```py
name = "Tommy Vercetti"
print(name[:5])    # Tommy   (from start to 5)
print(name[6:])    # Vercetti (from 6 to the end)
```

---

You have a variable **name** on the right, set to **"lance vance"**. Display, **on separate lines**

```text
LANCE VANCE
lance vance
11
l
lance
vance
```

That is: the name in uppercase, in lowercase, its length, the first letter, the first 5 characters, and the last 5 characters

Run, modify the name to anything else (Cortez, Quincy, your own name), and see how the output changes :)
