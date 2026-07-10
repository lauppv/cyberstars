```py
def curata_text(text):
    rezultat = ""
    for caracter in text:
        if caracter.isalpha():
            rezultat += caracter.lower()
    return rezultat

def este_palindrom(cuvant):
    stanga = 0
    dreapta = len(cuvant) - 1
    while stanga < dreapta:
        if cuvant[stanga] != cuvant[dreapta]:
            return False
        stanga += 1
        dreapta -= 1
    return True

def sunt_anagrame(a, b):
    return sorted(curata_text(a)) == sorted(curata_text(b))

def inverseaza_cuvinte(propozitie):
    cuvinte = propozitie.split(" ")
    return " ".join(cuvinte[::-1])

text_palindrom = "A man, a plan, a canal: Panama"
anagrama_a = "Listen!"
anagrama_b = "Silent"
propozitie = "navigation system is online"
text_murdar = "S3ct0r 7 cl34r!"
print(este_palindrom(curata_text(text_palindrom)))
print(sunt_anagrame(anagrama_a, anagrama_b))
print(inverseaza_cuvinte(propozitie))
print(curata_text(text_murdar))
```
