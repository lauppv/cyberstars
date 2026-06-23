```py
galaxie1 = ["rigel", "vega", "sirius", "antares", "altair", "deneb", "spica", "betelgeuse", "mizar", "pollux"]
galaxie2 = ["mira", "capella", "arcturus", "procyon", "castor", "bellatrix", "alnitak", "saiph", "tania", "wezen"]
galaxie3 = ["fomalhaut", "regulus", "atria", "merak", "phecda", "dubhe", "alcor", "naos", "kaus", "sadr"]
galaxie4 = ["aldebaran", "hamal", "menkar", "diphda", "achird", "gienah", "tarazed", "rasalhague", "sheliak", "nashira"]
galaxie5 = ["alphard", "alkaid", "thuban", "rastaban", "eltanin", "vindemiatrix", "zosma", "chara", "muphrid", "seginus"]

def cea_mai_lunga_stea(galaxie):
    cea_mai_lunga = galaxie[0]
    for stea in galaxie:
        if len(stea) > len(cea_mai_lunga):
            cea_mai_lunga = stea
    return cea_mai_lunga

print(cea_mai_lunga_stea(galaxie1))
print(cea_mai_lunga_stea(galaxie2))
print(cea_mai_lunga_stea(galaxie3))
print(cea_mai_lunga_stea(galaxie4))
print(cea_mai_lunga_stea(galaxie5))
```
