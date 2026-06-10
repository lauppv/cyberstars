Wait, what was that?

```py
name = "Quincy"
age = 32
height = 1.97

print(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

What is that long, script-like **print()**? Well, first of all, let’s ask ourselves how we could display the values for **name**, **age**, and **height** inside a text

We could do it like this

```py
name = "Quincy"
age = 32
height = 1.90

print("Hello. My name is ", name, ", I am ", age, " years old, and I am ", height, " tall:")
```

The problem is that with this approach you have to be careful with spaces, commas, and quotes… **fun fact**: I messed up twice when I wrote this **XD**

We believe the best approach is the first one

```python
name = "Cortez"
age = 57
height = 1.67
print(f"Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

Obviously, **name**, **age**, and **height** are the variables. The **{}** symbols work as a _placeholder_. Inside them, if you put a variable, the **variable’s name will be replaced by its value**
However, we must not forget the **f**

```py
name = "Quincy"
age = 32
height = 1.90

print("Hello. My name is {name}, I am {age} years old, and I am {height} tall")
```

Now we **didn’t put that f**. What will be displayed? Correct, exactly the string

```text
Hello. My name is {name}, I am {age} years old, and I am {height} tall
```

And that’s because the **f** before the string tells Python, “hey, replace what’s inside {} with the respective values”
This process in programming is called **formatting** (hence the letter **f**)

---

## Mission: Flight Report

A pilot is about to launch. The details are stored in `pilot`, `ship_name`, `fuel`, and `speed`.

Using **f-strings**, print a three-line flight report:

- the pilot's name and the ship — like `Pilot Shadow is flying Orion`
- the fuel — like `Fuel: 400 units`
- the speed — like `Speed: 7.5 km/s`

**Input** (already set at the top of your code — change the values to test):

- `pilot`, `ship_name` — text
- `fuel` — a whole number
- `speed` — a number with decimals

**Example**

With the starter values, your program should print

```text
Pilot Shadow is flying Orion
Fuel: 400 units
Speed: 7.5 km/s
```
