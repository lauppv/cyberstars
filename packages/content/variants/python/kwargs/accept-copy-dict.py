def card(name, **details):
    print(name.upper())
    for k, v in details.items():
        print(f"  {k}: {v}")
    print("details:", len(details))


name = "Ada"
info = {"role": "engineer", "deck": 3}
card(name, **info)
card(name=name)
more = dict(info)
more["shift"] = "day"
card(name, **more)
