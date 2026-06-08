Am învățat că **return** trimite o valoare înapoi dintr-o funcție. Dar dacă vrem să trimitem înapoi **mai mult de o valoare**? De exemplu, o funcție care ne dă atât **minimul** cât și **maximul** unei liste

În multe limbaje de programare, asta e complicat. În Python, este minunat de simplu

```py
def minMax(numere):
    return min(numere), max(numere)

smallest, largest = minMax([5, 2, 8, 1, 9])
print(smallest)
print(largest)
```

Rezultat

```text
1
9
```

Ce s-a întâmplat? Funcția a **returnat două valori** separate printr-o virgulă. În exterior, le-am **despachetat** în două variabile, exact cum am făcut cu tuplele. De fapt, asta este exact ce face Python în culise — creează o **tuplă** și apoi o despachetează

```py
def minMax(numere):
    return min(numere), max(numere)

rezultat = minMax([5, 2, 8, 1, 9])
print(rezultat)
print(type(rezultat))
```

Rezultat

```text
(1, 9)
<class 'tuple'>
```

Vezi? Este o tuplă. **return a, b** este același lucru cu **return (a, b)**. Python ne lasă să sărim parantezele pentru comoditate

---

Asta este incredibil de util pentru funcțiile care calculează valori înrudite

```py
def playerStats(scoruri):
    total = sum(scoruri)
    average = total / len(scoruri)
    best = max(scoruri)
    return total, average, best

t, avg, top = playerStats([80, 95, 70, 88])
print(f"Total: {t}")
print(f"Medie: {avg}")
print(f"Cel mai bun: {top}")
```

Rezultat

```text
Total: 333
Medie: 83.25
Cel mai bun: 95
```

O singură funcție, trei valori utile înapoi. Curat

---

O altă utilizare frecventă: o funcție care **împarte** un nume complet

```py
def numeImpartit(numeComplet):
    parts = numeComplet.split(" ")
    prenume = parts[0]
    numeFamilie = parts[1]
    return prenume, numeFamilie

first, last = numeImpartit("Tommy Vercetti")
print(f"Prenume: {first}")
print(f"Nume: {last}")
```

Rezultat

```text
Prenume: Tommy
Nume: Vercetti
```

**.split(" ")** este o nouă metodă pentru șiruri: împarte un șir după un separator (în acest caz un spațiu) și returnează o **listă** cu părțile. Deci **"Tommy Vercetti".split(" ")** ne dă **["Tommy", "Vercetti"]**

---

## Misiune: Analizatorul de Coordonate

Scrie o funcție `parse(reading)` care primește un șir de trei numere separate prin spații (precum `"45 90 12"`) și returnează **trei valori**: **suma**, **cel mai mare** și **cel mai mic**.

În interiorul funcției, folosește `.split(" ")` ca să spargi șirul în părți și transformă fiecare parte într-un număr. Apoi **returnează** toate cele trei rezultate deodată.

În programul principal, **citește** o linie, apelează `parse`, **despachetează** cele trei valori și afișează-le.

**Input** (tastat de utilizator când rulează programul):

- trei numere pe o singură linie, separate prin spații

**Rezultat**

```text
Total: 147
Cel mai mare: 90
Cel mai mic: 12
```

**Exemplu**

Dacă utilizatorul tastează

```text
45 90 12
```

programul afișează rezultatul arătat mai sus.
