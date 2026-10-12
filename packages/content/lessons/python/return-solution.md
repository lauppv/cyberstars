```py
galaxy1 = ["rigel", "vega", "sirius", "antares", "altair", "deneb", "spica", "betelgeuse", "mizar", "pollux"]
galaxy2 = ["mira", "capella", "arcturus", "procyon", "castor", "bellatrix", "alnitak", "saiph", "tania", "wezen"]
galaxy3 = ["fomalhaut", "regulus", "atria", "merak", "phecda", "dubhe", "alcor", "naos", "kaus", "sadr"]
galaxy4 = ["aldebaran", "hamal", "menkar", "diphda", "achird", "gienah", "tarazed", "rasalhague", "sheliak", "nashira"]
galaxy5 = ["alphard", "alkaid", "thuban", "rastaban", "eltanin", "vindemiatrix", "zosma", "chara", "muphrid", "seginus"]

def longest_star(galaxy):
    longest = galaxy[0]
    for star in galaxy:
        if len(star) > len(longest):
            longest = star
    return longest

print(longest_star(galaxy1))
print(longest_star(galaxy2))
print(longest_star(galaxy3))
print(longest_star(galaxy4))
print(longest_star(galaxy5))
```
