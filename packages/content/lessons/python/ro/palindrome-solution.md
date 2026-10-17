```py
coduri = ["rotitor", "semnal", "capac", "orbita", "radar"]

def este_palindrom(cuvant):
    for i in range(len(cuvant) // 2):
        if cuvant[i] != cuvant[len(cuvant) - 1 - i]:
            return False
    return True

valide = 0
for cod in coduri:
    rezultat = este_palindrom(cod)
    print(f"{cod}: {rezultat}")
    if rezultat:
        valide += 1
print(f"Semnale valide: {valide}")
```
