Ultimul nostru mini-proiect: un **manager de listă de sarcini**. O să construim funcții ca să **adăugăm**, **eliminăm**, **marcăm ca terminate**, și **afișăm** sarcini. Asta leagă tot la un loc: **liste**, **dicționare**, **funcții**, **bucle**, **if/else**, și **formatarea șirurilor**

---

Fiecare sarcină este un dicționar cu un **nume** și o stare **terminat**

```py
sarcina = {"nume": "Invata Python", "terminat": False}
```

Lista noastră de sarcini este o **listă** din aceste dicționare

```py
sarcini = [
    {"nume": "Invata Python", "terminat": True},
    {"nume": "Construieste un proiect", "terminat": False},
    {"nume": "Obtine un job la CyberStars", "terminat": False}
]
```

---

Hai să construim funcțiile una câte una

**Adăugarea unei sarcini**

```py
def adauga_sarcina(sarcini, nume):
    sarcini.append({"nume": nume, "terminat": False})
```

**Marcarea unei sarcini ca terminată** (după index)

```py
def finalizeaza_sarcina(sarcini, index):
    if 0 <= index < len(sarcini):
        sarcini[index]["terminat"] = True
```

**Eliminarea unei sarcini** (după index)

```py
def elimina_sarcina(sarcini, index):
    if 0 <= index < len(sarcini):
        sarcini.pop(index)
```

**.pop(index)** elimină elementul de pe acea poziție din listă

**Afișarea tuturor sarcinilor**

```py
def afiseaza_sarcini(sarcini):
    for i, sarcina in enumerate(sarcini):
        stare = "terminat" if sarcina["terminat"] else "neterminat"
        print(f"{i}. [{stare}] {sarcina['nume']}")
```

---

Punând totul cap la cap

```py
sarcini = []

adauga_sarcina(sarcini, "Termina curriculumul de Python")
adauga_sarcina(sarcini, "Incepe curriculumul de Java")
adauga_sarcina(sarcini, "Iesi la aer")

afiseaza_sarcini(sarcini)
print("---")

finalizeaza_sarcina(sarcini, 0)
afiseaza_sarcini(sarcini)
print("---")

elimina_sarcina(sarcini, 2)
afiseaza_sarcini(sarcini)
```

Ieșire

```text
0. [neterminat] Termina curriculumul de Python
1. [neterminat] Incepe curriculumul de Java
2. [neterminat] Iesi la aer
---
0. [terminat] Termina curriculumul de Python
1. [neterminat] Incepe curriculumul de Java
2. [neterminat] Iesi la aer
---
0. [terminat] Termina curriculumul de Python
1. [neterminat] Incepe curriculumul de Java
```

Fiecare funcție face **un singur lucru** și îl face bine. Acesta este un principiu de bază al programării bune. Funcțiile sunt mici, ușor de înțeles, și ușor de testat

---

O funcție de **numărare** este și ea utilă

```py
def numara_finalizate(sarcini):
    contor = 0
    for sarcina in sarcini:
        if sarcina["terminat"]:
            contor += 1
    return contor

def numara_nefinalizate(sarcini):
    return len(sarcini) - numara_finalizate(sarcini)
```

---

## Misiune: Tabla de Sarcini a Misiunii

Echipajul își urmărește munca pe o tablă de sarcini comună. Vei **citi sarcinile de la tastatură**, vei construi tabla, vei marca unele ca terminate, apoi o afișezi. Fiecare sarcină este un dicționar cu un `nume` și o stare `terminat`, iar tabla este o listă din aceste dicționare.

Scrie trei funcții:

- **adauga_sarcina(sarcini, nume)** — adaugă o sarcină nouă la listă cu `terminat` setat pe `False`.
- **finalizeaza_sarcina(sarcini, index)** — marchează sarcina de la acel index ca terminată.
- **numara_finalizate(sarcini)** — returnează câte sarcini sunt terminate.

Apoi:

1. Citește un număr **N**, apoi citește **N nume de sarcini** (câte unul pe linie) și adaugă fiecare în tablă.
2. Citește încă o linie cu **indecșii de finalizat**, separați prin spații (de exemplu `0 2`), și marchează fiecare dintre acele sarcini ca terminată.
3. **Afișează** tabla: pentru fiecare sarcină afișează indexul ei, apoi `. `, apoi `[terminat]` sau `[in asteptare]`, apoi numele sarcinii.
4. La final afișează `Finalizat: ` urmat de numărul de sarcini terminate, un `/`, și totalul.

**Intrare:**

```text
3
Ruleaza diagnoza
Realimenteaza reactorul
Traseaza traseul
0 2
```

**Ieșire**

```text
0. [terminat] Ruleaza diagnoza
1. [in asteptare] Realimenteaza reactorul
2. [terminat] Traseaza traseul
Finalizat: 2/3
```
