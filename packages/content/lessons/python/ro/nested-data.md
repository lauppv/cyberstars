Datele adevărate sunt rar o singură listă simplă. Un echipaj e o listă de oameni, iar fiecare om are un nume, o vârstă și o listă de abilități. În Python construim asta punând liste și dicționare unele în altele. Asta se numește date **imbricate**

---

O listă poate conține dicționare. Fiecare dicționar e o persoană

```py
echipaj = [
    {"nume": "Ada", "varsta": 36},
    {"nume": "Alan", "varsta": 41},
]
print(echipaj[1])
print(echipaj[1]["nume"])
```

Rezultat

```text
{'nume': 'Alan', 'varsta': 41}
Alan
```

Citim de la stânga. `echipaj[1]` e a doua persoană, un dicționar. Apoi `["nume"]` scoate numele din acel dicționar

---

Un dicționar poate conține liste. Aici fiecare planetă are o listă cu lunile ei

```py
luni = {
    "Pamant": ["Luna"],
    "Marte": ["Phobos", "Deimos"],
}
print(luni["Marte"])
print(luni["Marte"][0])
print(len(luni["Marte"]))
```

Rezultat

```text
['Phobos', 'Deimos']
Phobos
2
```

---

Ca să trecem prin date imbricate, punem o buclă în alta, câte una pentru fiecare nivel

```py
echipaj = [
    {"nume": "Ada", "abilitati": ["matematica", "cod"]},
    {"nume": "Alan", "abilitati": ["cod"]},
]
for persoana in echipaj:
    print(persoana["nume"])
    for abilitate in persoana["abilitati"]:
        print("  -", abilitate)
```

Rezultat

```text
Ada
  - matematica
  - cod
Alan
  - cod
```

Bucla din afară ne dă câte o persoană. Bucla din interior trece prin abilitățile acelei persoane

---

Și datele imbricate se pot schimba. Ajungem la lista din interior și folosim `append`, ca la orice listă

```py
luni = {"Pamant": ["Luna"], "Marte": []}
luni["Marte"].append("Phobos")
luni["Marte"].append("Deimos")
for planeta, nume in luni.items():
    print(planeta, len(nume))
```

Rezultat

```text
Pamant 1
Marte 2
```

---

## Misiune: Cine se pricepe

Ceva s-a stricat pe stație, iar căpitanul trebuie să știe cine din echipaj are abilitatea să repare

1. Începe programul cu două variabile: **echipaj**, o listă de dicționare, fiecare cu un `"nume"` (un string) și `"abilitati"` (o listă de string-uri), și **necesar**, un string: abilitatea pe care o caută căpitanul. De exemplu `echipaj = [{"nume": "Ada", "abilitati": ["matematica", "cod"]}, {"nume": "Alan", "abilitati": ["cod", "radio"]}]` și `necesar = "radio"`
2. Pentru fiecare persoană, afișează numele, `: ` și abilitățile ei unite cu `, `. O persoană fără abilități primește `nicio abilitate` în loc
3. Afișează `Se pricep: ` și numele persoanelor care au abilitatea necesară, unite cu `, `, în ordinea din echipaj. Dacă nu o are nimeni, afișează `Se pricep: nimeni`

**echipaj** are între 1 și 10 persoane, iar fiecare persoană are între 0 și 5 abilități

**Exemplu** pentru echipajul și abilitatea de mai sus

```text
Ada: matematica, cod
Alan: cod, radio
Se pricep: Alan
```
