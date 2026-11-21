def card(name, **details):
    print(name)
    for k, v in details.items():
        print(f"  {k}: {v}")
    print(f"details: {len(details)}")


name = "Ada"
info = {"role": "engineer", "deck": 3}
card(name, **info)
card(name)
card(name, **info, shift="day")
