```py
piloti = [
    {"nume": "kai", "timp": 50},
    {"nume": "Ada", "timp": 42},
    {"nume": "ben", "timp": 50},
]

rezultate = sorted(piloti, key=lambda p: (p["timp"], p["nume"].lower()))
for loc, pilot in enumerate(rezultate, start=1):
    print(f"{loc}. {pilot['nume']} {pilot['timp']}s")

nume = []
for pilot in piloti:
    nume.append(pilot["nume"])
nume.sort(key=lambda n: n.lower())
print(f"Dupa nume: {', '.join(nume)}")
```
