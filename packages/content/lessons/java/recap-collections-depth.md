Use a HashSet, a TreeMap and a loop together

---

## Mission: Malibu Club Night

It is a big night at the Malibu Club. The bouncer writes down every name that comes through the door. People step out and come back, so some names show up many times. In the morning, Tommy wants to know who came, how often, and who loved the club the most

The names are in a `String[] arrivals` array, in the order people came. For each one, print `Welcome, name` the first time the name shows up and `Back again, name` every time after that. When the night is over, print `Guest book:` and then each guest as `name: visits`, sorted by name. Last, print `Most loyal: name`, the guest with the most visits. If several guests have the most visits, pick the one whose name comes first in alphabetical order. There is always at least one arrival

**Example**

```text
Welcome, Tommy
Welcome, Lance
Back again, Tommy
Welcome, Candy
Back again, Lance
Back again, Tommy
Guest book:
Candy: 1
Lance: 2
Tommy: 3
Most loyal: Tommy
```

**Example**

```text
Welcome, Phil
Welcome, Kent
Guest book:
Kent: 1
Phil: 1
Most loyal: Kent
```
