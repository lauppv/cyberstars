We already saw that we can do **addition** with **+**. But **Python** knows much more than that. Let’s take a closer look at what we can do with numbers

```py
a = 17
b = 5

print(a + b)   # addition
print(a - b)   # subtraction
print(a * b)   # multiplication
print(a / b)   # division
```

Output

```text
22
12
85
3.4
```

Nothing too crazy so far. **+ - \*** behave exactly like in math. The only "interesting" one is **/**, since **17 / 5** gives back **3.4** (a number with decimals), not **3**

But what if we **only want the whole part** of the division? **17 / 5 = 3** with a remainder of **2**. We have a special operator for that

```py
a = 17
b = 5
print(a // b)   # integer division
```

This will print **3**. We threw away the remainder. **//** is called **integer division**

And what if we **only want the remainder**? Same idea, different operator

```py
a = 17
b = 5
print(a % b)   # remainder (modulo)
```

This will print **2**. The **%** operator gives us the **remainder** of the division. It’s called the **modulo** operator. Don’t worry about the name, just remember what it does :)

**% is extremely useful**. For example, how do we know if a number is **even**? An even number is one that divides by **2 with no remainder**. So **n % 2 == 0** means n is even

```py
n = 10
if n % 2 == 0:
    print("even")
else:
    print("odd")
```

There is one more operator, used for **powers**

```py
print(2 ** 3)   # 2 to the power of 3
```

This will print **8**, because **2 _ 2 _ 2 = 8**. The **\*\*** operator means **power**. So **5 ** 2** is **25**, **3 ** 4** is **81**, and so on

---

A very important detail is the **order of operations**. **Python** respects math rules: multiplication and division happen before addition and subtraction

```py
print(2 + 3 * 4)    # 14, not 20
print((2 + 3) * 4)  # 20
```

Just like in math, parentheses **()** force what to do first. When in doubt, **add parentheses**. They make the code easier to read anyway

---

## Mission: Calculator Readout

The station's calculator panel takes two whole numbers and shows everything Python can do with them. Write a program that **reads two numbers** and prints, **on separate lines**, the result of every operator you just learned.

Read both numbers with **int()** so they are real numbers, not text.

**Input** (typed by the user when the program runs):

- the first number
- the second number

**Output**

Seven lines, in this order: addition, subtraction, multiplication, division, integer division, remainder, and power.

**Example**

If the user types

```text
17
5
```

the program should print

```text
22
12
85
3.4
3
2
1419857
```
