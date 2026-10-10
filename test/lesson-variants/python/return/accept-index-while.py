galaxy1 = ["rigel", "vega", "sirius", "antares", "altair", "deneb", "spica", "betelgeuse", "mizar", "pollux"]
galaxy2 = ["mira", "capella", "arcturus", "procyon", "castor", "bellatrix", "alnitak", "saiph", "tania", "wezen"]
galaxy3 = ["fomalhaut", "regulus", "atria", "merak", "phecda", "dubhe", "alcor", "naos", "kaus", "sadr"]
galaxy4 = ["aldebaran", "hamal", "menkar", "diphda", "achird", "gienah", "tarazed", "rasalhague", "sheliak", "nashira"]
galaxy5 = ["alphard", "alkaid", "thuban", "rastaban", "eltanin", "vindemiatrix", "zosma", "chara", "muphrid", "seginus"]


def longest_star(galaxy):
    best_i = 0
    i = 1
    while i < len(galaxy):
        if len(galaxy[i]) > len(galaxy[best_i]):
            best_i = i
        i += 1
    return galaxy[best_i]

answers = [longest_star(galaxy1), longest_star(galaxy2), longest_star(galaxy3), longest_star(galaxy4), longest_star(galaxy5)]
print("\n".join(answers))
