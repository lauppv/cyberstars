```py
sisteme = [("Sol", 0, 8), ("Alpha", 4, 3), ("Vega", 25, 5)]

total_planete = 0
for sistem in sisteme:
    nume, distanta, planete = sistem
    print(f"{nume}: {distanta} al, {planete} planete")
    total_planete = total_planete + planete

print(f"Total planete: {total_planete}")
```
