def dock(ship, bay="A1", priority="normal"):
    print(f"{ship} docked at {bay} ({priority})")


ship1 = "Voyager"
ship2 = "Odyssey"
ship3 = "Pioneer"

dock("Voyager")
dock("Odyssey", "B7")
dock("Pioneer", priority="urgent")
