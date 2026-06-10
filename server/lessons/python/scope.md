We've been using variables everywhere: inside loops, inside functions, outside functions. But have you ever wondered — can a variable created **inside** a function be used **outside** of it?

```py
def greet():
    message = "Hello from Vice City"
    print(message)

greet()
print(message)
```

**Run** this. The first **print** works (inside the function), but the second one crashes with a **NameError**: name 'message' is not defined

Why? Because **message** was created **inside** the function, and it only exists there. Once the function finishes, **message** is gone. This is called **scope**

---

A variable's **scope** is the area of code where it exists and can be used. In Python, there are two main scopes

**Local scope**: variables created inside a function. They only exist inside that function

```py
def f():
    x = 10
    print(x)

f()
# print(x) would crash here
```

**Global scope**: variables created outside any function. They can be read from anywhere

```py
name = "Tommy Vercetti"

def greet():
    print(f"Hello, {name}")

greet()
print(name)
```

Both prints work. **name** was created at the top level, so the function can **see** it

---

But what if we try to **change** a global variable inside a function?

```py
health = 100

def take_damage():
    health = health - 10
    print(health)

take_damage()
```

**Run** it. Error! Python sees **health = ...** inside the function and thinks we're creating a **new local variable** called health. But on the right side, we also use **health**, and the local one doesn't exist yet. Confusing? Yes. That's why **scope** is important to understand

The simple rule: if you **assign** to a variable inside a function, Python treats it as **local**. Even if a global variable has the same name

---

The clean solution? **Pass values as parameters and return results**

```py
health = 100

def take_damage(hp):
    hp = hp - 10
    return hp

health = take_damage(health)
print(health)
```

Output **90**. We passed **health** into the function, the function did its thing, and returned the new value. No confusion about scope

This is the best practice: **functions receive data through parameters and send data back through return**. They don't reach out and grab global variables

---

A quick example showing that variables in **different functions** are completely separate

```py
def f():
    x = 5
    print(x)

def g():
    x = 99
    print(x)

f()
g()
```

Output

```text
5
99
```

Two different **x** variables. They just happen to have the same name, but they live in different functions, so they don't interfere with each other

---

## Mission: Shield Boost

Write a function `boost(shield)` that **returns** the shield value doubled. It must work only with its **parameter** and **return** the result — it should not reach out to any global variable (that's the whole point of scope).

Then, in the main program:

1. Set `shield = 100`
2. Print `Before: ` then shield
3. Call `boost(shield)` **without storing** the result, then print `Ignored: ` then shield — notice it's unchanged, because the return value was thrown away
4. Now do `shield = boost(shield)` and print `After: ` then shield

**Output**

```text
Before: 100
Ignored: 100
After: 200
```

The `Ignored` line proves the function can't change the global on its own — the new value only sticks when you **store the return**.
