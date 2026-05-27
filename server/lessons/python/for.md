Welcome to probably one of the **most important** lessons we can learn in the world of programming - the **for** loop

Why is it important? Let's suppose we want to display all the numbers from 0 to 10

We could do it like this

```py
print("1")
print("2")
print("3")
print("4")
print("5")
print("6")
print("7")
print("8")
print("9")
print("10")
```

It’s clear that we **repeated** the code, and that is completely **forbidden**. Why? Well, wat happens if we want to display all the numbers from **1 to 1000**? There’s no way we want **1000 print()** statements and to modify them manually

This is where the power of the **for** loop comes in

```py
i = 1
for i in range(1, 1000):
    print(i)
```

This will print all the numbers from **1 to 999**. Why doesn’t it include **1000**? **range()** is a **function** that already exists in **Python** and tells us where we want to **start** and where we want to **stop - 1**. That is, **range(1, 1000)** means from **1 to 999**. If we want from **1 to 1000**, we can say **range(1, 1001)**

```py
i = 1
for i in range(1, 1001):
    print(i)
```

Now we see all the numbers from **1 to 1000**

Let’s explain this code

**i = 1**

**for** looks at **i** and checks the variable i from before. It knows **i = 1**, so it starts from there. Then **for** looks further and sees **range(1, 1001)**. It knows this means **all numbers from 1 to 1000 (1001 - 1)**, so it takes **i** and in each iteration increases it by **1**, like **i = i + 1**

First, **i = 1**, then it enters the block and prints it, after which it **automatically does i = i + 1**

Now **i = 2**, it prints it, then again does **i = i + 1**

Now **i = 3**, it prints it, then does **i = i + 1 again**

... and so on **:)**. Isn’t it fascinating? We basically make the computer do this **repetition** for us

**in** is a keyword. It tells **Python** to take the variable **i** and check it against **range()**

---

Write a Python program that displays all the numbers from **0 to 100**. If the number is **10** or **50**, display _Pizza Margherita_. **Otherwise** display the value of **i**
