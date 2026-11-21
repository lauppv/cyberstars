O funcție obișnuită merge până la `return` și gata. Un **generator** e o funcție care se poate opri la mijloc, poate da o valoare și apoi poate continua de unde a rămas. Folosește `yield` în loc de `return`

---

Orice funcție cu `yield` în ea e un generator. Apelul ei nu îi rulează încă codul: ne dă un obiect generator, gata să dea valori

```py
def trei():
    yield "unu"
    yield "doi"
    yield "trei"

for cuvant in trei():
    print(cuvant)
```

Rezultat

```text
unu
doi
trei
```

Bucla `for` îi cere generatorului o valoare. Codul merge până la primul `yield`, dă `"unu"` și se oprește acolo. Bucla cere din nou, iar codul continuă de unde s-a oprit, până la următorul `yield`. Când codul ajunge la final, bucla se oprește

---

`next()` îi cere de mână unui generator următoarea valoare. Așa se vede clar cum se oprește

```py
def numaratoare(start):
    print("pornim")
    while start > 0:
        yield start
        start -= 1

ceas = numaratoare(3)
print(next(ceas))
print(next(ceas))
print(list(ceas))
```

Rezultat

```text
pornim
3
2
[1]
```

`pornim` e afișat o singură dată, la primul `next()`. Generatorul își ține minte variabilele între valori: `start` e încă 2 când vine al doilea `next()`. `list()` ia toate valorile rămase. Un generator dă fiecare valoare o dată, așa că după asta e gol

Dacă îi cerem cu `next()` unui generator gol, programul se oprește cu o eroare StopIteration. O a doua valoare între paranteze e ce ne dă `next()` în loc, când nu mai rămâne nimic

```py
def numaratoare(start):
    while start > 0:
        yield start
        start -= 1

print(next(numaratoare(0), "nimic"))
print(next(numaratoare(2), "nimic"))
```

Rezultat

```text
nimic
2
```

---

De ce nu returnăm pur și simplu o listă? Un generator face fiecare valoare doar când i se cere. Nu le ține pe toate în memorie și se poate opri mai devreme. Poate chiar să meargă la nesfârșit, cât timp bucla care îl folosește se oprește

```py
def patrate():
    n = 1
    while True:
        yield n * n
        n += 1

gasite = []
for p in patrate():
    if p > 50:
        break
    gasite.append(p)
print(gasite)
```

Rezultat

```text
[1, 4, 9, 16, 25, 36, 49]
```

`while True` nu s-ar termina niciodată într-o funcție obișnuită. Aici e în regulă: generatorul se oprește la fiecare `yield`, iar `break` din bucla noastră nu mai cere

---

Un generator poate folosi și valorile primite ca parametri, iar `return` îl poate termina mai devreme. Un `return` într-un generator doar îl oprește, fără să mai dea ceva

```py
def pare_pana_la(limita):
    for n in range(0, limita + 1, 2):
        if n > 6:
            return
        yield n

print(list(pare_pana_la(100)))
```

Rezultat

```text
[0, 2, 4, 6]
```

---

## Misiune: Arderea combustibilului

O navă arde aceeași cantitate de combustibil la fiecare puls al motorului, până nu mai poate arde o cantitate întreagă

1. Scrie un generator **arde(combustibil, rata)** care dă combustibilul rămas după fiecare puls: întâi `combustibil - rata`, apoi `combustibil - 2 * rata` și tot așa. Se oprește înainte ca combustibilul să scadă sub 0. Folosește `yield`
2. Începe programul cu două variabile: **combustibil** și **rata**, două numere întregi. De exemplu `combustibil = 10` și `rata = 3`
3. Afișează `Primul: ` și prima valoare a unui generator nou, folosind `next()`. Dacă generatorul nu are nicio valoare, afișează `Primul: niciunul`
4. Afișează câte o linie pentru fiecare puls al altui generator nou: `Puls `, numărul pulsului numărat de la 1, `: ` și combustibilul rămas
5. Afișează `Pulsuri: ` și câte pulsuri au fost

**combustibil** e de la 0 la 200, iar **rata** de la 1 la 50

**Exemplu** pentru combustibil = 10 și rata = 3

```text
Primul: 7
Puls 1: 7
Puls 2: 4
Puls 3: 1
Pulsuri: 3
```

Un combustibil de exact 0 după un puls tot contează: pentru combustibil = 6 și rata = 3 pulsurile sunt 3 și 0
