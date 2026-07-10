```py
def dock(ship, bay="A1", priority="normal"):
    print(f"{ship} docked at {bay} ({priority})")

ship1 = "Voyager"
ship2 = "Odyssey"
ship3 = "Pioneer"

dock(ship1)
dock(ship2, "B7")
dock(ship3, priority="urgent")
```
