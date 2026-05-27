One of the most common things you'll do in programming is **count** things. How many even numbers? How many words longer than 5 letters? How many players are online? This is the **counter pattern**

The idea is simple: start with a variable at **0**, loop through the data, and **increase by 1** every time we find what we're looking for

```py
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evenCount = 0

for n in numbers:
    if n % 2 == 0:
        evenCount = evenCount + 1

print(f"Even numbers: {evenCount}")
```

Output **Even numbers: 5**

The structure is always the same:

1. **Initialize** the counter to 0
2. **Loop** through the data
3. **Check** a condition
4. If the condition is true, **increase** the counter

---

Let's count how many characters in a name are uppercase

```py
name = "Tommy Vercetti"
upperCount = 0

for char in name:
    if char.isupper():
        upperCount = upperCount + 1

print(f"Uppercase letters: {upperCount}")
```

Output **Uppercase letters: 2** (T and V)

**.isupper()** is a string method that returns **True** if the character is uppercase. There's also **.islower()**, **.isdigit()**, **.isalpha()**, and more

---

We can count multiple things at once

```py
text = "Hello World 123"
letters = 0
digits = 0
spaces = 0

for char in text:
    if char.isalpha():
        letters = letters + 1
    elif char.isdigit():
        digits = digits + 1
    elif char == " ":
        spaces = spaces + 1

print(f"Letters: {letters}, Digits: {digits}, Spaces: {spaces}")
```

Output **Letters: 10, Digits: 3, Spaces: 2**

---

By the way, Python has a shortcut for **x = x + 1**. We can write **x += 1** instead. Same thing, less typing

```py
count = 0
count += 1
count += 1
count += 1
print(count)
```

Output **3**. Works with other operators too: **x -= 1**, **x \*= 2**, **x /= 3**

---

You have a list of **scores**. Count and display

1. How many scores are **above or equal to 50** (passed)
2. How many scores are **below 50** (failed)

Expected output

```text
Passed: 4
Failed: 2
```
