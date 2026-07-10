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
next_year = age + 1
print(next_year)
```

You will get an error. **Why?** Because **input() always gives back a string**, even if the user types numbers. So **age** is **"18"** (text), not **18** (number). And we cannot do **"18" + 1**, since one is text and the other is a number

To fix it, we tell **Python**: "hey, take this text and turn it into a number"

```py
age = int(input("Your age: "))
next_year = age + 1
print(next_year)
```

**int()** is a function that converts text into an **integer** (a whole number). Now **age** is really **18**, and **18 + 1 = 19** works perfectly

If the user typed something with decimals like **1.75**, we’d use **float()** instead

```py
height = float(input("Your height: "))
print(height)
```

---

## Mission: Crew Check-In

The space station registers every new crew member. Write a program that **asks** for the crew member's **name**, then their **age**, and prints a welcome message.

Remember that **input()** always gives back a **string**, so you must turn the age into a number with **int()** before you can add **1** to it.

**Input:**

- the crew member's name
- the crew member's age

**Output**

One line: `Welcome aboard, ` then the name, then `! You are ` the age, then `. Next year you will be ` the age plus one, then a `.`

**Example**

If the user types

```text
Cortez
60
```

the program should print

```text
Welcome aboard, Cortez! You are 60. Next year you will be 61.
```
