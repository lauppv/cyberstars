```py
def card(name, **details):
    print(name.upper())
    for key, value in details.items():
        print(f"  {key}: {value}")
    print(f"details: {len(details)}")


name = "Ada"
info = {"role": "engineer", "deck": 3}

card(name, **info)
card(name)
card(name, **info, shift="day")
```
