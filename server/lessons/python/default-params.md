We learned that functions take **parameters**. But sometimes, most of the time a parameter has the **same value**, and only occasionally do we want to change it. It would be annoying to pass it every single time

For example, imagine a function that creates a player profile
```py
def createPlayer(name, health, city):
    print(f"{name} | HP: {health} | City: {city}")

createPlayer("Tommy", 100, "Vice City")
createPlayer("Lance", 100, "Vice City")
createPlayer("Cortez", 100, "Vice City")
createPlayer("Phil", 50, "Vice City")
```
We wrote **100** and **"Vice City"** three out of four times. That's a lot of repetition. What if we could say "health is 100 **by default** and city is Vice City **by default**, unless I say otherwise"?

```py
def createPlayer(name, health=100, city="Vice City"):
    print(f"{name} | HP: {health} | City: {city}")

createPlayer("Tommy")
createPlayer("Lance")
createPlayer("Phil", 50)
createPlayer("Cortez", 100, "San Andreas")
```
Output
```text
Tommy | HP: 100 | City: Vice City
Lance | HP: 100 | City: Vice City
Phil | HP: 50 | City: Vice City
Cortez | HP: 100 | City: San Andreas
```

**health=100** and **city="Vice City"** are **default values**. If we don't pass anything for those parameters, Python uses the defaults. If we **do** pass something, it overrides the default

---

**Important rule**: parameters with default values must come **after** parameters without defaults

```py
def f(a, b=10, c=20):
    print(a, b, c)
```
This is fine. **a** has no default, **b** and **c** do

```py
def f(a=10, b, c):
    print(a, b, c)
```
**Run** this. Python gives us a **SyntaxError**. You can't put a parameter without a default **after** one that has a default. Think about it — Python wouldn't know which value belongs to which parameter

---

We can also use **keyword arguments** to skip parameters
```py
def createPlayer(name, health=100, city="Vice City"):
    print(f"{name} | HP: {health} | City: {city}")

createPlayer("Tommy", city="Liberty City")
```
Output **Tommy | HP: 100 | City: Liberty City**

We skipped **health** (kept the default 100) and only changed **city** by using its **name**. Without keyword arguments, we'd have to write **createPlayer("Tommy", 100, "Liberty City")** — passing 100 even though it's the default

---

Write a function **greet** that takes a **name** and an optional **greeting** with a default value of **Hello**

The function should display **{greeting}, {name}!**

```py
greet("Shrek")                 # Hello, Shrek!
greet("Fiona", "Welcome")     # Welcome, Fiona!
greet("Donkey", "Hey there")  # Hey there, Donkey!
```

Expected output
```text
Hello, Shrek!
Welcome, Fiona!
Hey there, Donkey!
```