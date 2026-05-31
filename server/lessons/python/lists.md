So far, every variable held **one** thing: one name, one number, one boolean. But what if I want to store the names of all the characters from **GTA Vice City**?

I could do this

```py
name1 = "Tommy Vercetti"
name2 = "Lance Vance"
name3 = "Cortez"
name4 = "Phil Cassidy"
name5 = "Sonny Forelli"
```

Ugly. And what if I wanted **100** names? **1000**? No way. There has to be a better solution

There is. It’s called a **list**

```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy", "Sonny Forelli"]
print(names)
```

A **list** is a **collection** of values stored in a single variable. We use the square brackets **[ ]** and separate the elements with **commas**

If we run this, **Python** will display the whole list at once

```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy', 'Sonny Forelli']
```

---

We can also access **a single element** of the list, just like we did with strings: by **index**

```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(names[0])    # Tommy Vercetti
print(names[1])    # Lance Vance
print(names[2])    # Cortez
```

Once again, **counting starts from 0**. The first element is **names[0]**, NOT **names[1]**

What happens if we ask for an index that doesn’t exist?

```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(names[10])
```

**Run** it. You’ll see **Python** complains with an **IndexError**, because there is no element at position **10**. Always read your errors :)

---

How many elements does a list have? **len()** again

```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(len(names))   # 3
```

Same **len()** that we used on strings. **Python** is smart about it

---

We can **add** new elements to a list with **.append()**

```py
names = ["Tommy Vercetti", "Lance Vance"]
names.append("Cortez")
names.append("Phil Cassidy")
print(names)
```

Output

```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy']
```

**.append()** adds the new element **at the end** of the list. The list has **changed**, this is different from **upper()** and **lower()** on strings, which returned a new string. Lists are modified **in place**

---

We can also **change** a value at a given index

```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
names[1] = "Lance Vance Dance"
print(names)
```

Output

```text
['Tommy Vercetti', 'Lance Vance Dance', 'Cortez']
```

---

Lists can hold any kind of values, not just strings

```py
ages = [42, 35, 60, 29]
prices = [3.14, 9.99, 12.50]
flags = [True, False, True]
```

We can even mix them, but in practice it’s rare and usually a sign that something is wrong with the design

---

## Mission: Cargo Bay

The station tracks its cargo in a list. You start with an **empty list** `cargo` (already on the right). Do the following, in order:

1. **Add** `oxygen`, `water`, `food`, and `fuel` using **.append()**
2. Print how many items are loaded (use **len()**)
3. Print the **first** item
4. Print the **last** item
5. A leak ruins the water — **replace** the item at index 1 with `EMPTY`
6. Print the **whole list**

**Output**

```text
4
oxygen
fuel
['oxygen', 'EMPTY', 'food', 'fuel']
```

Notice the last line: when you print a whole list, Python shows the brackets and quotes for you. Add more cargo and run again to see how the numbers change :)
