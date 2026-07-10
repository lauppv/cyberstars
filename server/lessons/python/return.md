In the **functions** lesson, all our functions did the same thing: they **printed** something on the screen. But functions can do something much more powerful, they can **give us a value back** that we can use later

Imagine: I ask a friend "what’s 2 + 3?". I want them to **answer** me with **5**, not to **shout** the answer at the wall. I want to take that **5** and use it for something else

This is what **return** does in a function

```py
def add(a, b):
    return a + b

result = add(2, 3)
print(result)
```

Output **5**

What happened? The function **add** **took** two numbers, **calculated** their sum, and **returned** the result. We caught that result in the variable **result**, then printed it

Compare this with the old style we used

```py
def add_and_print(a, b):
    print(a + b)

add_and_print(2, 3)
```

This just prints. It doesn’t give anything back. If I wanted to take the result and **multiply** it by 10, I couldn’t. The function did its thing and the value is **gone**

With **return**, we can chain functions together

```py
def add(a, b):
    return a + b

result = add(2, 3) * 10
print(result)
```

Output **50**. **add(2, 3)** gave us **5**, then we multiplied by **10**. Try doing that with a function that only **prints**, you can’t

---

The real point of a function is that you write the logic **once** and then use it **as many times as you want**, with different arguments. You stop repeating the code in the body

Imagine we have three sensors giving us the temperature in **Celsius**, but we want it in **Fahrenheit**. Without a function, we’d repeat the same formula every time

```py
sensor1 = 20 * 9 / 5 + 32
sensor2 = 37 * 9 / 5 + 32
sensor3 = 100 * 9 / 5 + 32
print(sensor1)
print(sensor2)
print(sensor3)
```

The same formula, written **three times**. If we get something wrong in it, we have to fix it in every place. And what if we had **a hundred** sensors?

With a function, we write the formula **once** in its body and then **call** it with different arguments

```py
def in_fahrenheit(c):
    return c * 9 / 5 + 32

print(in_fahrenheit(20))
print(in_fahrenheit(37))
print(in_fahrenheit(100))
```

Output

```text
68.0
98.6
212.0
```

The function’s body — the formula — is written **once**. We reuse it three times, changing only the **argument**. That’s what a function gives us, in the end: you write the code once and never repeat it

---

A function can return **anything**, not just numbers. Strings, booleans, lists, anything

```py
def greet(name):
    return f"Hello, {name}!"

message = greet("Cortez")
print(message)
```

Output **Hello, Cortez!**

```py
def is_adult(age):
    return age >= 18

print(is_adult(20))    # True
print(is_adult(15))    # False
```

This function returns a **boolean**. Notice that we can use **is_adult(20)** **directly inside print()**, no need for a separate variable. **Python** runs the function first, then **print()** shows the returned value

We can even use it inside an **if**

```py
def is_adult(age):
    return age >= 18

age = 25
if is_adult(age):
    print("Welcome")
else:
    print("Sorry, too young")
```

Cleaner than writing **if age >= 18** everywhere, especially if our condition gets complicated

---

**Important**: as soon as **Python** sees **return**, the function **exits immediately**. Anything written after **return** is **NOT** executed

```py
def f():
    return 1
    print("never printed")   # this never runs

print(f())
```

Output is just **1**. The **print** inside the function is **dead code**, it never runs

We can use this to exit a function **early**

```py
def divide(a, b):
    if b == 0:
        return "cannot divide by zero"
    return a / b

print(divide(10, 2))    # 5.0
print(divide(10, 0))    # cannot divide by zero
```

---

By the way, a function that has no **return** still works, it just gives back a special value called **None**

```py
def f():
    print("hello")

result = f()
print(result)
```

Output

```text
hello
None
```

**None** is **Python**’s way of saying "nothing". You don’t need to worry about it now, just know it exists :)

---

## Mission: Atlas of Galaxies

In the editor you already have **five galaxies**, each a **list** of ten star names.

Write **one** function called `longest_star` that takes a galaxy (the list) and **returns** the name of the star with the most letters in that galaxy.

Then **call it five times**, once for each galaxy, and print what it returns. You write the function once, but use it for all five lists — without repeating the code in the body.

**Output**

Five lines, one name per line: the longest star in each galaxy, in order.

**Example**

If a galaxy were `["rigel", "vega", "betelgeuse", "spica"]`, the function would return `betelgeuse`.

For the galaxies in the editor, the program should print

```text
betelgeuse
bellatrix
fomalhaut
rasalhague
vindemiatrix
```
