def dock(name, bay="A1", priority="normal"):
    line = name + " docked at " + bay + " (" + priority + ")"
    print(line)


ship1 = "Voyager"
ship2 = "Odyssey"
ship3 = "Pioneer"

dock(ship1)
dock(ship2, "B7")
dock(ship3, priority="urgent")
