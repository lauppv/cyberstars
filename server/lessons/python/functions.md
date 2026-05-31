As we mentioned in a previous lesson, it’s not a good idea to **repeat** code. If we have to write the same thing twice, chances are we’ll need to write it three times or **more**. This is where the notion of a **function** comes in. A **function** is a piece of code that we write **once** and can reuse **multiple** times

```py
name = "Cortez"
age = 60

i = 0
for i in range(0, 11):
    print(f"My name is {name} and my age is {age}")
```

Output:

```text
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
My name is Cortez and my age is 60
```

What happens if we want to display the same thing but with _Tommy Vercetti_ and age _42_? Of course, we can change the variable values

```py
name = "Tommy Vercetti"
age = 42

i = 0
for i in range(0, 11):
    print(f"My name is {name} and my age is {age}")
```

Output:

```text
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
My name is Tommy Vercetti and my age is 42
```

and that’s fine

However, if we want to use this piece of code **later** in the program with **different values for name and age**, we would always have to **copy and paste** this **for** loop

It turns out that the best way, and the one that makes the code most **readable**, is to use a **function**

```py
def myFunction(name, age):
    i = 0
    for i in range(0, 11):
        print(f"My name is {name} and my age is {age}")

myFunction("Cortez", 60)
myFunction("Tommy Vercetti", 42)
myFunction("Lance Vance Dance", 35)
```

We can see how our code is much **cleaner** and **easier** to read. What we did was **reuse** the **function** called **myFunction** and call it with different values. We wrote the function **once** and can run it as many times as we want with different values

The word **def** defines a **function** in Python

**myFunction** is the **name** of the function, meaning the name we use to **call** this function

Just like **print()**, we use parentheses **()**

Inside the parentheses, we write whatever we want to name the parameters. In this case, **name** and **age**

Remember that the **parameter names can be anything**. The code below works as well

```py
def myFunction(n, a):
    i = 0
    for i in range(0, 11):
        print(f"My name is {n} and my age is {a}")

myFunction("Cortez", 60)
myFunction("Tommy Vercetti", 42)
myFunction("Lance Vance Dance", 35)
```

After naming a function, we must put a **:**

Another example of a function could be

```py
def f(name, status):
    if(status == True):
        print(f"{name} is online")
    else:
        print(f"{name} is offline")

name = "Admin"
isOnline = True
f(name, isOnline) # prints Admin is online

isOnline = False
f(name, isOnline) # prints admin is offline
```

---

## Mission: Onboard Calculator

Write a function `calculator(number1, number2, operator)` that prints the result of `number1 operator number2`. The `+` case is already written for you in the starter — add the cases for **subtraction** (`-`), **multiplication** (`*`), and **division** (`/`). For any other operator, print `Invalid operator`.

Format each result like `14 + 12 = 26`.

**Input** (the calls at the bottom of your code test the function — change them too):

- `calculator(14, 12, "+")`, `calculator(20, 8, "-")`, `calculator(6, 7, "*")`, `calculator(20, 4, "/")`

**Example**

The four calls in the starter should print

```text
14 + 12 = 26
20 - 8 = 12
6 * 7 = 42
20 / 4 = 5.0
```

Notice that division gives a number with decimals — `20 / 4` is `5.0`, not `5`.
