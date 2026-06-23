A **string** is more than just a piece of text we display. **Python** offers us many tools to inspect and modify strings, and we’re going to look at the most useful ones

---

How long is a name? How many letters does it have? **len()** tells us

```py
name = "Tommy Vercetti"
print(len(name))
```

Output **14**. Yes, the **space** counts too. Every character matters, including commas, dots, exclamation marks, and any other character. Try with **len("password-!@#$")**

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

Now **name** stores the new value. This kind of trap catches absolutely everyone in the beginning. If we read from top to bottom, the story is simple: we have a name, then we turn it uppercase and update the name, then we print it

---

We can **glue strings together** with **+**. This is called **concatenation**

```py
first_name = "Tommy"
last_name = "Vercetti"
full_name = first_name + last_name
print(full_name)
```

Output **TommyVercetti**. If we want a space between the first name and the last name, we have to concatenate it too

```py
first_name = "Tommy"
last_name = "Vercetti"
full_name = first_name + " " + last_name
print(full_name)
```

---

We can grab a piece of a string by giving its **start** and **end** position

```py
name = "Tommy Vercetti"
print(name[0])      # T
print(name[1])      # o
print(name[0:5])    # Tommy
print(name[6:14])   # Vercetti
```

**name** is a variable - we already know that. Why is **name[0] = T**? Why is **name[1] = o**? In fact, why does **name[something] = something else**?

Let's imagine the variable **name** as a row of little boxes, each box holding a single character. Under each box is written its **position number**

```strindex
Tommy Vercetti
^ 0 1
```

In programming, counting starts from **0**, **NOT** from **1**. So **name[0]** is the **first** letter (the box at position 0, highlighted above), **name[1]** is the second, and so on. When we write **name[something]**, **something** is the position number, and Python gives us the character in that box. For example, **name[9]** means "give me the character at position **9** in **name**", which is the character **c**

**name[0:5]** means "from position **0**, up to but **NOT including** position **5**". So we take positions **0, 1, 2, 3, 4**, which spell **Tommy**. Just like with **range()** in the **for** loop, the end is exclusive (we don’t take it)

We can also leave one of the numbers out

```py
name = "Tommy Vercetti"
print(name[:5])    # Tommy   (from start to 5 - 1)
print(name[6:])    # Vercetti (from 6 to the end)
```

---

## Mission: Position Decoder

The station reads only certain positions from a code word. The program reads a word into a variable and prints, on separate lines:

- the character at position **0**
- the character at position **3**
- the first **4** characters
- the characters from position **4** to the end

**Example**

If the user types

```text
Andromeda
```

the program should print

```text
A
r
Andr
omeda
```
