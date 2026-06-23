Am învățat că **return** trimite o valoare înapoi dintr-o funcție. Dar dacă vrem să trimitem înapoi **mai mult de o valoare**? De exemplu, o funcție care ne dă atât **minimul** cât și **maximul** unei liste

În multe limbaje de programare, asta e complicat. În Python, este minunat de simplu

```py
def minim_maxim(numere):
    return min(numere), max(numere)

cel_mai_mic, cel_mai_mare = minim_maxim([5, 2, 8, 1, 9])
print(cel_mai_mic)
print(cel_mai_mare)
```

Ieșire

```text
1
9
```

Ce s-a întâmplat? Funcția a **returnat două valori** separate printr-o virgulă. În exterior, le-am **despachetat** în două variabile, exact cum am făcut cu tuplele. De fapt, asta este exact ce face Python în culise — creează o **tuplă** și apoi o despachetează

```py
def minim_maxim(numere):
    return min(numere), max(numere)

rezultat = minim_maxim([5, 2, 8, 1, 9])
print(rezultat)
print(type(rezultat))
```

Ieșire

```text
(1, 9)
<class 'tuple'>
```

Vezi? Este o tuplă. **return a, b** este același lucru cu **return (a, b)**. Python ne lasă să sărim parantezele pentru comoditate

---

Asta este incredibil de util pentru funcțiile care calculează valori înrudite

```py
def statistici_jucator(scoruri):
    total = sum(scoruri)
    medie = total / len(scoruri)
    cel_mai_bun = max(scoruri)
    return total, medie, cel_mai_bun

t, medie, varf = statistici_jucator([80, 95, 70, 88])
print(f"Total: {t}")
print(f"Medie: {medie}")
print(f"Cel mai bun: {varf}")
```

Ieșire

```text
Total: 333
Medie: 83.25
Cel mai bun: 95
```

O singură funcție, trei valori utile înapoi. Curat

---

O altă utilizare frecventă: o funcție care **împarte** un nume complet

```py
def nume_impartit(nume_complet):
    parti = nume_complet.split(" ")
    prenume = parti[0]
    nume_familie = parti[1]
    return prenume, nume_familie

primul, ultimul = nume_impartit("Tommy Vercetti")
print(f"Prenume: {primul}")
print(f"Nume: {ultimul}")
```

Ieșire

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

**Intrare** (tastat de utilizator când rulează programul):

- trei numere pe o singură linie, separate prin spații

**Ieșire**

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
