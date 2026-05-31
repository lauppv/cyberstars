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
def addAndPrint(a, b):
    print(a + b)

addAndPrint(2, 3)
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

A function can return **anything**, not just numbers. Strings, booleans, lists, anything

```py
def greet(name):
    return f"Hello, {name}!"

message = greet("Cortez")
print(message)
```

Output **Hello, Cortez!**

```py
def isAdult(age):
    return age >= 18

print(isAdult(20))    # True
print(isAdult(15))    # False
```

This function returns a **boolean**. Notice that we can use **isAdult(20)** **directly inside print()**, no need for a separate variable. **Python** runs the function first, then **print()** shows the returned value

We can even use it inside an **if**

```py
def isAdult(age):
    return age >= 18

age = 25
if isAdult(age):
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

## Mission: Reactor Safety

The station has three reactors and we care about the hottest one. Write a function `highest(a, b, c)` that **returns** the largest of three readings — use **if/elif/else** and **return** the value, do **not** print inside the function.

Then read three readings, call `highest` to find the top one, and report on safety:

- if the top reading is **above 100**, print `Reactor: DANGER`
- otherwise print `Reactor: stable`
- on a second line, print `Top reading: ` then the top value

**Input** (typed by the user when the program runs):

- three reactor readings, one per line

**Output**

Two lines: the safety message, then the top reading.

**Example**

If the user types

```text
88
132
95
```

the program should print

```text
Reactor: DANGER
Top reading: 132
```

If the user types

```text
40
90
75
```

the program should print

```text
Reactor: stable
Top reading: 90
```
