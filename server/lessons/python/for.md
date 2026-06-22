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

It's clear that we **repeated** the code, and that is completely **forbidden**. Why? Well, what happens if we want to display all the numbers from **1 to 1000**? There's no way we want **1000 print() statements** to modify manually

This is where the power of the **for** loop comes in

```py
i = 1
for i in range(1, 1000):
    print(i)
```

This will print all the numbers from **1 to 999**. Why doesn't it include **1000**? **range()** is a **function** that already exists in **Python** and tells us where we want to **start** and where we want to **stop - 1**. That is, **range(1, 1000)** means from **1 to 999**. If we want from **1 to 1000**, we can say **range(1, 1001)**

```py
i = 1
for i in range(1, 1001):
    print(i)
```

Now we see all the numbers from **1 to 1000**

Let's explain this code

**i = 1**

**for** looks at **i** and checks the variable i from before. It knows **i = 1**, so it starts from there. Then **for** looks further and sees **range(1, 1001)**. It knows this means **all numbers from 1 to 1000 (1001 - 1)**, so it takes **i** and on each iteration increases it by **1**, like **i = i + 1**

First, **i = 1**, then it enters the block and prints it, after which it **automatically does i = i + 1**

Now **i = 2**, it prints it, then again does **i = i + 1**

Now **i = 3**, it prints it, then does **i = i + 1** again

... and so on **:)**. Isn't it fascinating? We basically make the computer do this **repetition** for us

**in** is a keyword. It tells **Python** to take the variable **i** and check it against **range()**

---

## More about range()

So far we've given **range()** two numbers - where it **starts** and where it **stops - 1**. But **range()** is more flexible than that

If we give it a **single** number, **Python** assumes we want to start from **0**

```py
for i in range(5):
    print(i)
```

This prints **0, 1, 2, 3, 4** - that is, **5** numbers starting from **0**

We can also give a **third** number, called the **step**. It says by **how much** we jump from one value to the next. For example, if we want only the **even** numbers from 0 to 10

```py
for i in range(0, 11, 2):
    print(i)
```

This prints **0, 2, 4, 6, 8, 10**. Instead of **i = i + 1**, now **for** does **i = i + 2** on each step

---

## Combining for with variables

Remember **variables**? We can use them together with **for** to **gather** a result over the course of the loop

Let's suppose we want to **add up** all the numbers from **1 to 5**. We need a variable to hold the **total**. We declare it **before** the loop, with the value **0**, and increase it on each iteration

```py
total = 0
for i in range(1, 6):
    total = total + i
print(total)
```

Let's follow what happens:

- at the start **total = 0**
- **i = 1** → **total = 0 + 1 = 1**
- **i = 2** → **total = 1 + 2 = 3**
- **i = 3** → **total = 3 + 3 = 6**
- **i = 4** → **total = 6 + 4 = 10**
- **i = 5** → **total = 10 + 5 = 15**

At the end, **print(total)** prints **15**

Very important: **print(total)** is **outside** the loop (it has no leading spaces). If we put it **inside**, we would see the total after **every** step, not just at the end

```py
total = 0
for i in range(1, 6):
    total = total + i
    print(total)
```

Now we moved **print(total)** **inside** the loop, so it prints the total on every iteration

```text
1
3
6
10
15
```

---

## Combining for with if

We already know **if**. What happens if we put it **inside** a **for** loop? Then **Python** checks the condition on **every** iteration

For example, we want to print only the **even** numbers from 1 to 10

```py
for i in range(1, 11):
    if i % 2 == 0:
        print(i)
```

On each value of **i**, we enter the loop and check **if i % 2 == 0** (that is, "the remainder of the division by 2 is 0", so the number is even). If yes, we print it. If not, we skip it and move on

This prints **2, 4, 6, 8, 10**

Notice the **two** levels of spacing: **if** is indented once (it's inside **for**), and **print** is indented twice (it's inside **if**)

---

## Mission: The Energy Collector

The station gathers energy from a series of cells numbered from **1** to `cells`. Only the cells with an **odd** number work — the rest are broken.

Make a variable for how many `cells` there are (you choose the name and value), then write a program that:

- if there are **0** cells → print `No cells`
- if there is **1** cell → print `A single cell`
- otherwise → loop with **for** over the numbers from **1** to `cells`, **add up** only the odd numbers into a variable `total`, and print `total`

**Examples**

With **6** cells, the odd ones are **1, 3, 5**, so the program prints

```text
9
```

With **0** cells it prints

```text
No cells
```

With **1** cell it prints

```text
A single cell
```
