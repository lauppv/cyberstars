Sometimes we don't need to count things or accumulate a result. We just need to know: **did something happen or not?** Yes or no. This is the **flag pattern**

A **flag** is a boolean variable that starts as **True** or **False** and flips when a certain condition is met

```py
numbers = [2, 4, 6, 8, 10]
all_even = True

for n in numbers:
    if n % 2 != 0:
        all_even = False

if all_even:
    print("All numbers are even")
else:
    print("Not all numbers are even")
```

Output **All numbers are even**

We started with the assumption **all_even = True** (optimistic, we believe they're all even). If we find even one number that's **not** even, we set the flag to **False**. At the end, we check the flag

```py
numbers = [2, 4, 7, 8, 10]
all_even = True

for n in numbers:
    if n % 2 != 0:
        all_even = False

if all_even:
    print("All numbers are even")
else:
    print("Not all numbers are even")
```

Output **Not all numbers are even** (because of the 7)

---

The opposite works too: starting with **False** and switching to **True**

```py
names = ["Tommy", "Lance", "Cortez", "Phil"]
target = "Cortez"
found = False

for name in names:
    if name == target:
        found = True

if found:
    print(f"{target} is in the list!")
else:
    print(f"{target} is not in the list")
```

Output **Cortez is in the list!**

We start pessimistic (**found = False**) and only switch to **True** if we actually find the target

---

We can combine the flag with **break** for efficiency. Once we found what we need, why keep looking?

```py
names = ["Tommy", "Lance", "Cortez", "Phil"]
target = "Lance"
found = False

for name in names:
    if name == target:
        found = True
        break

if found:
    print(f"Found {target}!")
else:
    print(f"{target} not found")
```

---

A practical example: checking if a password is **strong** (has at least one uppercase letter, one lowercase letter, and one digit)

```py
password = "Tommy123"
has_upper = False
has_lower = False
has_digit = False

for char in password:
    if char.isupper():
        has_upper = True
    elif char.islower():
        has_lower = True
    elif char.isdigit():
        has_digit = True

if has_upper and has_lower and has_digit:
    print("Strong password")
else:
    print("Weak password")
```

Output **Strong password**. Three flags, one for each requirement

---

## Mission: Access Code Check

A station access code is **valid** only if it meets **all three** rules: it has at least one **uppercase** letter, at least one **digit**, and is at least **6 characters** long.

**Read** a code, then use **flags** (`has_upper` and `has_digit`, each starting `False` and flipped to `True` when you find one) plus a length check. Print each result, then the verdict:

**Input:**

- the access code

**Output** — four lines: the three checks, then `Access code valid` or `Access code invalid`.

**Example**

If the user types

```text
Orbit42
```

the program should print

```text
Has uppercase: True
Has digit: True
Long enough: True
Access code valid
```

If the user types

```text
orbit
```

the program should print

```text
Has uppercase: False
Has digit: False
Long enough: False
Access code invalid
```
