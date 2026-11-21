One star catches values given in order. Two stars, `**kwargs`, catch values given with names, however many there are, and put them in a **dictionary**

---

Each keyword argument becomes one pair in the dictionary: the name is the key, the value is the value

```py
def show(**details):
    print(details)

show(age=36, city="London")
show()
```

Output

```text
{'age': 36, 'city': 'London'}
{}
```

As with one star, the name after `**` is ours to pick. `**details`, `**options` and `**info` all work

---

Since it's a dictionary, we loop over it with `.items()`, as in Looping over Dictionaries. The pairs come in the order they were given

```py
def badge(name, **details):
    print(name)
    for key, value in details.items():
        print(f"  {key}: {value}")

badge("Ada", role="engineer", deck=3)
```

Output

```text
Ada
  role: engineer
  deck: 3
```

`name` takes the first value, given in order. Everything given with a name goes into `details`

---

Two stars also work in a call. When we have a dictionary, `**` in front of it turns each pair into a keyword argument

```py
def badge(name, **details):
    print(name)
    for key, value in details.items():
        print(f"  {key}: {value}")

info = {"role": "pilot", "deck": 1}
badge("Alan", **info)
badge("Grace", **info, shift="night")
```

Output

```text
Alan
  role: pilot
  deck: 1
Grace
  role: pilot
  deck: 1
  shift: night
```

The second call mixes both: the pairs of `info`, then one more keyword argument written by hand

---

A function can have all of them, in this order: normal parameters, `*args`, then `**kwargs`. Python decides where each value goes: in order to the normal ones, the rest in order to `*args`, and all with names to `**kwargs`

```py
def log(event, *numbers, **tags):
    print(event, numbers, tags)

log("dock", 4, 7, ship="Hope")
```

Output

```text
dock (4, 7) {'ship': 'Hope'}
```

---

## Mission: Crew Cards

Every crew member gets a card. Some people have many details, some have none, so the card must work with any details at all

1. Write a function **card(name, \*\*details)** that prints the name in capitals, then one line for each detail: two spaces, the detail's name, `: ` and its value, in the order the details were given. The last line is `details: ` and how many details there were
2. Start your program with two variables: **name**, a string, and **info**, a dictionary of details. For example `name = "Ada"` and `info = {"role": "engineer", "deck": 3}`
3. Call `card()` three times: with the name and all the details in `info`, with the name alone, and with the name, all the details in `info` and one more, `shift="day"`

**info** has from 0 to 6 details. Their names are small letters only, and never `shift` or `name`

**Example** for the values above

```text
ADA
  role: engineer
  deck: 3
details: 2
ADA
details: 0
ADA
  role: engineer
  deck: 3
  shift: day
details: 3
```
