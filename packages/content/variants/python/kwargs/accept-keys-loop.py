def card(name, **extra):
    lines = [name.upper()]
    for key in extra:
        lines.append("  " + key + ": " + str(extra[key]))
    lines.append("details: " + str(len(extra)))
    print("\n".join(lines))


name = "Ada"
info = {"role": "engineer", "deck": 3}
card(name, **info)
card(name)
card(name, **info, shift="day")
