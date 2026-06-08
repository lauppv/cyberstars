Acum că știm ce este un dicționar, e timpul să-l **parcurgem** cu o buclă. La fel cum am parcurs listele, putem parcurge dicționarele. Dar pentru că un dicționar are **chei** și **valori**, lucrurile sunt puțin diferite

```py
player = {
    "nume": "Tommy Vercetti",
    "health": 100,
    "oras": "Vice City"
}

for key in player:
    print(key)
```

Afișează

```text
nume
health
oras
```

Stai, a afișat doar **cheile**? Da. În mod implicit, când parcurgem un dicționar, Python ne dă **cheile**. Dar putem obține ușor și **valoarea**

```py
player = {
    "nume": "Tommy Vercetti",
    "health": 100,
    "oras": "Vice City"
}

for key in player:
    print(f"{key} -> {player[key]}")
```

Afișează

```text
nume -> Tommy Vercetti
health -> 100
oras -> Vice City
```

Am folosit **player[key]** ca să luăm valoarea pentru fiecare cheie. Asta funcționează, dar Python are o metodă mai frumoasă

---

**.items()** ne dă atât **cheia** cât și **valoarea** în același timp

```py
player = {
    "nume": "Tommy Vercetti",
    "health": 100,
    "oras": "Vice City"
}

for key, value in player.items():
    print(f"{key} -> {value}")
```

Același rezultat, dar mai curat. Partea cu **key, value** se numește **despachetare (unpacking)**, Python pune cheia într-o variabilă și valoarea în cealaltă

---

Dacă avem nevoie doar de **chei**, putem folosi **.keys()**

```py
player = {"nume": "Tommy", "health": 100}

for k in player.keys():
    print(k)
```

Afișează

```text
nume
health
```

Dacă avem nevoie doar de **valori**, folosim **.values()**

```py
player = {"nume": "Tommy", "health": 100}

for v in player.values():
    print(v)
```

Afișează

```text
Tommy
100
```

---

Un caz de utilizare foarte des întâlnit: **numărarea lucrurilor**. Să zicem că vrem să numărăm de câte ori apare fiecare literă într-un cuvânt

```py
cuvant = "banana"
counter = {}

for litera in cuvant:
    if litera in counter:
        counter[litera] = counter[litera] + 1
    else:
        counter[litera] = 1

print(counter)
```

Afișează

```text
{'b': 1, 'a': 3, 'n': 2}
```

Acesta se numește **dicționar de frecvențe** sau **histogramă**. Verificăm: este litera deja în dicționar? Dacă da, creștem numărul. Dacă nu, îl pornim de la **1**. Acest tipar apare **peste tot** în programare, așa că studiază-l cu atenție :)

---

**len()** funcționează și pe dicționare

```py
player = {"nume": "Tommy", "health": 100, "oras": "Vice City"}
print(len(player))
```

Afișează **3** — dicționarul are 3 perechi cheie-valoare

---

## Misiune: Scorurile Echipajului

Ai un dicționar cu membrii echipajului și scorurile lor de misiune (deja în dreapta). Parcurge-l și construiește un raport.

Afișează, în această ordine:

1. Fiecare membru ca `nume: scor` (parcurge cu **.items()**)
2. `Total: ` apoi suma tuturor scorurilor
3. `Medie: ` apoi totalul împărțit la câți membri sunt
4. `Top: ` apoi **numele** membrului cu cel mai mare scor

**Output**

```text
Tommy: 95
Lance: 80
Cortez: 70
Phil: 90
Total: 335
Medie: 83.75
Top: Tommy
```
