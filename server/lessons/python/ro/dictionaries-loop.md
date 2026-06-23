Acum că știm ce este un dicționar, e timpul să-l **parcurgem** cu o buclă. La fel cum am parcurs listele, putem parcurge dicționarele. Dar pentru că un dicționar are **chei** și **valori**, lucrurile sunt puțin diferite

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}

for i in jucator:
    print(i)
```

Afișează

```text
nume
viata
oras
```

Stai, a afișat doar **cheile**? Da. În mod implicit, când parcurgem un dicționar, Python ne dă **cheile**. Dar putem obține ușor și **valorile**

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}

for i in jucator:
    print(jucator[i])
```

Afișează

```text
Tommy Vercetti
100
Vice City
```

Am folosit **jucator[i]** ca să luăm valoarea pentru fiecare cheie. Am luat **i** ca iterator, care ia pe rând fiecare cheie din dicționar. Asta funcționează, dar Python are o metodă mai frumoasă

---

**.items()** ne dă atât **cheia** cât și **valoarea** în același timp

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}

for cheie, valoare in jucator.items():
    print(f"Cheia {cheie} cu valoare {valoare}")
```

Vedem cum Python vede **jucator.items()**, știe că asta înseamnă pereche `cheie: valoare`, așa că atribuie automat **cheie** cu ce se află la stânga de **:** ("nume", "viata", "oras") și **valoare** cu ce se află la dreapta de **:** ("Tommy Vercetti", 100, "Vice City")

---

Dacă avem nevoie doar de **chei**, putem folosi **.keys()**

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}

for c in jucator.keys():
    print(c)
```

Afișează

```text
nume
viata
oras
```

Dacă avem nevoie doar de **valori**, folosim **.values()**

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}
for v in jucator.values():
    print(v)
```

Afișează

```text
Tommy Vercetti
100
Vice City
```

---

Un caz de utilizare foarte des întâlnit: **numărarea lucrurilor**. Să zicem că vrem să numărăm de câte ori apare fiecare literă într-un cuvânt

```py
cuvant = "banana"
contor = {}

for litera in cuvant:
    if litera in contor:
        contor[litera] = contor[litera] + 1
    else:
        contor[litera] = 1

print(contor)
```

Afișează

```text
{'b': 1, 'a': 3, 'n': 2}
```

Acesta se numește **dicționar de frecvențe** sau **histogramă**. Verificăm: este litera deja în dicționar? Dacă da, creștem numărul. Dacă nu, îl pornim de la **1**

---

**len()** funcționează și pe dicționare

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "oras": "Vice City"
}
print(len(jucator))
```

Afișează **3** — dicționarul are 3 perechi cheie-valoare

---

## Misiune: Scorurile Echipajului

Ai un dicționar cu membrii echipajului și scorurile lor de la ultima misiune (deja în dreapta). Parcurge-l și construiește un raport.

Afișează, în această ordine:

1. `Numele` fiecărui membru (parcurge cu **.keys()**)
2. `Scorul` fiecărui membru (parcurge cu **.values()**)
3. `Total: ` apoi suma tuturor scorurilor
4. `Medie: ` apoi totalul împărțit la numărul de membri (folosește **len()**)
5. `Top: ` apoi **numele** membrului cu cel mai mare scor

**Ieșire**

```text
Tommy
Lance
Cortez
Phil
Ken
Sonny
Diaz
Avery
Umberto
Mercedes
88
95
70
90
65
78
84
72
60
83
Total: 785
Medie: 78.5
Top: Lance
```
