Ultimul nostru mini-proiect: un **manager de listă de sarcini**. O să construim funcții ca să **adăugăm**, **eliminăm**, **marcăm ca terminate**, și **afișăm** sarcini. Asta leagă tot la un loc: **liste**, **dicționare**, **funcții**, **bucle**, **if/else**, și **formatarea șirurilor**

---

Fiecare sarcină este un dicționar cu un **nume** și o stare **done**

```py
sarcina = {"nume": "Invata Python", "done": False}
```

Lista noastră de sarcini este o **listă** din aceste dicționare

```py
todos = [
    {"nume": "Invata Python", "done": True},
    {"nume": "Construieste un proiect", "done": False},
    {"nume": "Obtine un job la CyberStars", "done": False}
]
```

---

Hai să construim funcțiile una câte una

**Adăugarea unei sarcini**

```py
def adauga_sarcina(todos, nume):
    todos.append({"nume": nume, "done": False})
```

**Marcarea unei sarcini ca terminată** (după index)

```py
def finalizeaza_sarcina(todos, index):
    if 0 <= index < len(todos):
        todos[index]["done"] = True
```

**Eliminarea unei sarcini** (după index)

```py
def elimina_sarcina(todos, index):
    if 0 <= index < len(todos):
        todos.pop(index)
```

**.pop(index)** elimină elementul de pe acea poziție din listă

**Afișarea tuturor sarcinilor**

```py
def afiseaza_sarcini(todos):
    for i, sarcina in enumerate(todos):
        stare = "terminat" if sarcina["done"] else "neterminat"
        print(f"{i}. [{stare}] {sarcina['nume']}")
```

---

Punând totul cap la cap

```py
todos = []

adauga_sarcina(todos, "Termina curriculumul de Python")
adauga_sarcina(todos, "Incepe curriculumul de Java")
adauga_sarcina(todos, "Iesi la aer")

afiseaza_sarcini(todos)
print("---")

finalizeaza_sarcina(todos, 0)
afiseaza_sarcini(todos)
print("---")

elimina_sarcina(todos, 2)
afiseaza_sarcini(todos)
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
def numara_finalizate(todos):
    contor = 0
    for sarcina in todos:
        if sarcina["done"]:
            contor += 1
    return contor

def numara_nefinalizate(todos):
    return len(todos) - numara_finalizate(todos)
```

---

## Misiune: Tabla de Sarcini a Misiunii

Echipajul își urmărește munca pe o tablă de sarcini comună. Construiește funcțiile care o gestionează, apoi afișează tabla finalizată. Fiecare sarcină este un dicționar cu un `nume` și o stare `done`, iar tabla este o listă din aceste dicționare.

Scrie trei funcții:

- **adauga_sarcina(sarcini, nume)** — adaugă o sarcină nouă la listă cu `done` setat pe `False`.
- **finalizeaza_sarcina(sarcini, index)** — marchează sarcina de la acel index ca terminată.
- **numara_finalizate(sarcini)** — returnează câte sarcini sunt terminate.

Codul de start din dreapta construiește deja tabla (adaugă trei sarcini, finalizează două dintre ele). După aceea, **afișează** tabla: pentru fiecare sarcină afișează indexul ei, apoi `. `, apoi `[terminat]` sau `[în așteptare]`, apoi numele sarcinii. La final afișează `Finalizat: ` urmat de numărul de sarcini terminate, un `/`, și totalul.

**Ieșire**

```text
0. [terminat] Ruleaza diagnoza
1. [in asteptare] Realimenteaza reactorul
2. [terminat] Traseaza traseul
Finalizat: 2/3
```
