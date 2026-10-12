def describe(s, b, p):
    return "{} docked at {} ({})".format(s, b, p)


def dock(ship, bay="A1", priority="normal"):
    print(describe(ship, bay, priority))


ship1 = "Voyager"
ship2 = "Odyssey"
ship3 = "Pioneer"

for args, kwargs in [((ship1,), {}), ((ship2, "B7"), {}), ((ship3,), {"priority": "urgent"})]:
    dock(*args, **kwargs)
