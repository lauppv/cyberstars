Python's errors are classes: `ValueError`, `TypeError`, all of them inherit from one class called `Exception`. So we can make our own errors, with names that say exactly what went wrong in our program

---

An error of our own is a class that inherits from `Exception`. Often it needs nothing else, so its body is just `pass`

```py
class NotEnoughFuel(Exception):
    pass

def launch(fuel):
    if fuel < 100:
        raise NotEnoughFuel(f"need 100, have {fuel}")
    return "launched"

try:
    launch(40)
except NotEnoughFuel as e:
    print("No launch:", e)
```

Output

```text
No launch: need 100, have 40
```

The name tells the reader what happened before they even read the message. And `except NotEnoughFuel` catches only this problem, not some other `ValueError` from somewhere else

---

Our errors can have a family, like any classes. A parent error for the whole program, and children for each problem. Catching the parent catches all its children

```py
class StationError(Exception):
    pass

class NotEnoughFuel(StationError):
    pass

class DockClosed(StationError):
    pass

for problem in [NotEnoughFuel("low fuel"), DockClosed("dock 2 closed")]:
    try:
        raise problem
    except StationError as e:
        print(type(e).__name__, "-", e)
```

Output

```text
NotEnoughFuel - low fuel
DockClosed - dock 2 closed
```

`type(e).__name__` is the name of the error's class

---

When there are several `except` blocks, Python uses the first one that fits, from the top. So put the special cases first and the general one last

```py
class StationError(Exception):
    pass

class NotEnoughFuel(StationError):
    pass

try:
    raise NotEnoughFuel("low fuel")
except NotEnoughFuel:
    print("send a tanker")
except StationError:
    print("call the captain")
```

Output

```text
send a tanker
```

---

An error can carry data too. Give it an `__init__` that keeps the data and passes the message to `Exception`'s own `__init__` with `super()`

```py
class NotEnoughFuel(Exception):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing

try:
    raise NotEnoughFuel(25)
except NotEnoughFuel as e:
    print(e)
    print(e.missing + 10)
```

Output

```text
short by 25
35
```

The code that catches it can use `e.missing` as a number, not only read the message

---

## Mission: Fuel Desk

Ships ask the station for fuel, one request after another. The fuel desk serves a request when it can, and says clearly why when it can't

1. Write a class **StationError** that inherits from `Exception`, and two classes that inherit from it: **UnknownShip** and **NotEnoughFuel**. `NotEnoughFuel` takes the missing amount, keeps it as `missing`, and has the message `short by` and the missing amount
2. Write a function **refuel(name, amount, stock, known)** that raises `UnknownShip` with the message `unknown ship` if the name isn't in the list `known`, raises `NotEnoughFuel` if the amount is bigger than the stock, and otherwise returns the stock left after the refuel
3. Start your program with three variables: **stock**, a whole number, **known**, a list of ship names, and **requests**, a list of strings, each a name and an amount, like `"Hope 40"`. For example `stock = 100`, `known = ["Hope", "Swift"]` and `requests = ["Hope 40", "Bob 10", "Swift 80", "Swift 50"]`
4. For each request, call `refuel()`. Print the name, `: got ` and the amount when it works. When `NotEnoughFuel` is raised, print the name, `: ` and its message. When any other `StationError` is raised, print the name, `: refused, ` and its message
5. Print `Left: ` and the stock, and `Missing in total: ` and the missing amounts of all the `NotEnoughFuel` errors added up

**stock** is from 0 to 1000, amounts are from 1 to 500, and there are from 1 to 10 requests

**Example** for the values above

```text
Hope: got 40
Bob: refused, unknown ship
Swift: short by 20
Swift: got 50
Left: 10
Missing in total: 20
```
