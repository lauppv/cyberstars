```py
echipaj = {"nume": "Tommy", "rol": "Pilot", "varsta": 34}

echipaj["statie"] = "Laniakea"
echipaj["varsta"] = echipaj["varsta"] + 1

print(echipaj["nume"])
print(echipaj["rol"])
print(echipaj["varsta"])
print(echipaj["statie"])

if "rang" not in echipaj:
    print("Rang: necunoscut")
```
