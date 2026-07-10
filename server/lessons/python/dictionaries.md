So far we have stored values in variables and in lists. A **list** is great when we have a bunch of values and we access them by their **position** (index 0, 1, 2, …). But what if we don't care about position and instead we care about a **name**?

Imagine Tommy Vercetti's phone book. He doesn't say "give me contact number 3". He says "give me **Cortez's** phone number". The **name** is the way he looks things up

This is exactly what a **dictionary** does in Python

```py
phone_book = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(phone_book["Cortez"])
```

Output **555-1234**

A dictionary is created with **curly braces {}**. Inside, we write **key: value** pairs separated by **commas**. The **key** is what we use to look things up (like the name), and the **value** is what we get back (like the phone number)

```py
phone_book = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(phone_book["Lance"])
print(phone_book["Phil"])
```

Output

```text
555-5678
555-9999
```

---

What happens if we ask for a key that doesn't exist?

```py
phone_book = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

print(phone_book["Sonny"])
```

**Run** it. You'll see a **KeyError**. Python is telling us: "I don't know any Sonny"

---

We can **add** a new entry or **change** an existing one very easily

```py
phone_book = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

phone_book["Tommy"] = "555-0000"
print(phone_book["Tommy"])

phone_book["Lance"] = "555-1111"
print(phone_book["Lance"])
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
phone_book = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

del phone_book["Lance"]
print(phone_book)
```

Output

```text
{'Cortez': '555-1234'}
```

Lance is gone. Sorry Lance :)

---

To check if a key **exists** before accessing it, use **in**

```py
phone_book = {"Cortez": "555-1234"}

if "Cortez" in phone_book:
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
    "is_alive": True,
    "weapons": ["bat", "pistol", "shotgun"]
}

print(player["name"])
print(player["health"])
print(player["weapons"])
```

---

## Mission: Crew Database

In the editor you're given four details about a crew member as variables: `name`, `role`, `age`, and `station`.

Do the following, in order:

1. **Create** a dictionary `crew` with three keys — `"name"`, `"role"`, and `"age"` — using the `name`, `role`, and `age` variables as their values
2. **Add** a new key `"station"`, using the `station` variable as its value
3. It's the crew member's birthday — **update** `age` inside the dictionary by adding **1** to it (use the + operator)
4. Print the values for `name`, `role`, `age`, and `station`, each on its own line
5. We don't track rank yet — if the key `"rank"` is **not in** the dictionary, print `Rank: unknown`

**Output**

For the values in the editor, the program prints something like

```text
Tommy
Pilot
35
Laniakea
Rank: unknown
```

Change a value at the top and run again — the report follows.
