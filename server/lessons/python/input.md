Until now, all the values in our programs were written by us, the programmer. We chose **name = "Tommy Vercetti"**, we chose **age = 42**. But what if we want the **user** to choose? What if we want the program to ask us something and react based on what we typed?

This is where **input()** comes in

```py
name = input()
print(f"Hello, {name}!")
```

We **run** this code, type something (for example **Lance**) and press **Enter**. The program will display

```text
Hello, Lance!
```

The program **stopped** and **waited** for us. The moment **Python** sees **input()**, it stops the program and waits for the user to type something. After we press **Enter**, whatever we typed gets stored in the variable **name**

We can also give the user a **hint** about what we want them to type

```py
name = input("What's your name? ")
print(f"Hello, {name}!")
```

That little message inside **input("...")** is shown to the user before the program waits. It’s called a **prompt**

---

Now, here is something **really important**. Run this code

```py
age = input("Your age: ")
nextYear = age + 1
print(nextYear)
```

You will get an error. **Why?** Because **input() always gives back a string**, even if the user types numbers. So **age** is **"18"** (text), not **18** (number). And we cannot do **"18" + 1**, since one is text and the other is a number

To fix it, we tell **Python**: "hey, take this text and turn it into a number"

```py
age = int(input("Your age: "))
nextYear = age + 1
print(nextYear)
```

**int()** is a function that converts text into an **integer** (a whole number). Now **age** is really **18**, and **18 + 1 = 19** works perfectly

If the user typed something with decimals like **1.75**, we’d use **float()** instead

```py
height = float(input("Your height: "))
print(height)
```

---

Write a program that **asks** the user for their **name** and their **age**, then displays

```text
Hello <name>, you are <age> years old. Next year you will be <age + 1>
```

Example. If the user types

```text
Cortez
60
```

then the program should display

```text
Hello Cortez, you are 60 years old. Next year you will be 61
```

Don’t forget that **age** comes back as a **string** :)
