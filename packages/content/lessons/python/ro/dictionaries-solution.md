```py
nume = "Tommy"
rol = "Pilot"
varsta = 34
statie = "Laniakea"

echipaj = {"nume": nume, "rol": rol, "varsta": varsta}
echipaj["statie"] = statie
echipaj["varsta"] = echipaj["varsta"] + 1

print(echipaj["nume"])
print(echipaj["rol"])
print(echipaj["varsta"])
print(echipaj["statie"])

if "rang" not in echipaj:
    print("Rang: necunoscut")
```
