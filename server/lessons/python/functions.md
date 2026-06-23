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
def my_function(name, age):
    i = 0
    for i in range(0, 11):
        print(f"My name is {name} and my age is {age}")

my_function("Cortez", 60)
my_function("Tommy Vercetti", 42)
my_function("Lance Vance Dance", 35)
```

We can see how our code is much **cleaner** and **easier** to read. What we did was **reuse** the **function** called **my_function** and call it with different values. We wrote the function **once** and can run it as many times as we want with different values

The word **def** defines a **function** in Python

**my_function** is the **name** of the function, meaning the name we use to **call** this function

Just like **print()**, we use parentheses **()**

Inside the parentheses, we write whatever we want to name the parameters. In this case, **name** and **age**

Remember that the **parameter names can be anything**. The code below works as well

```py
def my_function(n, a):
    i = 0
    for i in range(0, 11):
        print(f"My name is {n} and my age is {a}")

my_function("Cortez", 60)
my_function("Tommy Vercetti", 42)
my_function("Lance Vance Dance", 35)
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
is_online = True
f(name, is_online) # prints Admin is online

is_online = False
f(name, is_online) # prints admin is offline
```

---

## Mission: Onboard Calculator

The station needs an onboard calculator. Write a function that takes two numbers and an operator (`+`, `-`, `*`, `/`) and prints the operation with its result. If the operator is not one of the four, print `Invalid operator`.

**Input and output examples**

- `calculator(14, 12, "+")` prints `14 + 12 = 26`
- `calculator(20, 8, "-")` prints `20 - 8 = 12`
- `calculator(6, 7, "*")` prints `6 * 7 = 42`
- `calculator(20, 4, "/")` prints `20 / 4 = 5.0`
- `calculator(5, 2, "%")` prints `Invalid operator`
