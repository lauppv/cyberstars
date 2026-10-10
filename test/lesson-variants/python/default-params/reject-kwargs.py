def dock(ship, *args, **kwargs):
    bay = args[0] if args else kwargs.get("bay", "A1")
    priority = args[1] if len(args) > 1 else kwargs.get("priority", "normal")
    print(f"{ship} docked at {bay} ({priority})")


ship1 = "Voyager"
ship2 = "Odyssey"
ship3 = "Pioneer"

dock(ship1)
dock(ship2, "B7")
dock(ship3, priority="urgent")
