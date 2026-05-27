So far we have stored values in variables and in lists. A **list** is great when we have a bunch of values and we access them by their **position** (index 0, 1, 2, …). But what if we don't care about position and instead we care about a **name**?

Imagine Tommy Vercetti's phone book. He doesn't say "give me contact number 3". He says "give me **Cortez's** phone number". The **name** is the way he looks things up

This is exactly what a **dictionary** does in Python

```py
phoneBook = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(phoneBook["Cortez"])
```

Output **555-1234**

A dictionary is created with **curly braces {}**. Inside, we write **key: value** pairs separated by **commas**. The **key** is what we use to look things up (like the name), and the **value** is what we get back (like the phone number)

```py
phoneBook = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(phoneBook["Lance"])
print(phoneBook["Phil"])
```

Output

```text
555-5678
555-9999
```

---

What happens if we ask for a key that doesn't exist?

```py
phoneBook = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

print(phoneBook["Sonny"])
```

**Run** it. You'll see a **KeyError**. Python is telling us: "I don't know any Sonny". Always read the error :)

---

We can **add** a new entry or **change** an existing one very easily

```py
phoneBook = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

phoneBook["Tommy"] = "555-0000"
print(phoneBook["Tommy"])

phoneBook["Lance"] = "555-1111"
print(phoneBook["Lance"])
```

Output

```text
555-0000
555-1111
```

If the key doesn't exist, Python **creates** it. If it already exists, Python **updates** it. Simple

---

We can also **remove** an entry with **del**

```py
phoneBook = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

del phoneBook["Lance"]
print(phoneBook)
```

Output

```text
{'Cortez': '555-1234'}
```

Lance is gone. Sorry Lance :)

---

To check if a key **exists** before accessing it, use **in**

```py
phoneBook = {"Cortez": "555-1234"}

if "Cortez" in phoneBook:
    print("Found Cortez!")
else:
    print("Cortez is not in the phone book")
```

---

Just like lists, dictionaries can hold **any type** of value: strings, numbers, booleans, even other lists or dictionaries

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "isAlive": True,
    "weapons": ["bat", "pistol", "shotgun"]
}

print(player["name"])
print(player["health"])
print(player["weapons"])
```

---

Create a dictionary called **hero** with the following keys and values

- **name** → **Shrek**
- **location** → **Swamp**
- **friends** → **2**

Then **add** a new key **color** with the value **green**

Finally, display each value on a separate line. Expected output

```text
Shrek
Swamp
2
green
```
