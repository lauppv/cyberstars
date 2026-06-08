Ultimul nostru mini-proiect: un **manager de listă de sarcini**. O să construim funcții ca să **adăugăm**, **eliminăm**, **marcăm ca terminate**, și **afișăm** sarcini. Asta leagă tot la un loc: **liste**, **dicționare**, **funcții**, **bucle**, **if/else**, și **formatarea șirurilor**

---

Fiecare sarcină este un dicționar cu un **nume** și o stare **done**

```py
task = {"nume": "Învață Python", "done": False}
```

Lista noastră de sarcini este o **listă** din aceste dicționare

```py
todos = [
    {"nume": "Învață Python", "done": True},
    {"nume": "Construiește un proiect", "done": False},
    {"nume": "Obține un job la CyberStars", "done": False}
]
```

---

Hai să construim funcțiile una câte una

**Adăugarea unei sarcini**

```py
def addTask(todos, nume):
    todos.append({"nume": nume, "done": False})
```

**Marcarea unei sarcini ca terminată** (după index)

```py
def completeTask(todos, index):
    if 0 <= index < len(todos):
        todos[index]["done"] = True
```

**Eliminarea unei sarcini** (după index)

```py
def removeTask(todos, index):
    if 0 <= index < len(todos):
        todos.pop(index)
```

**.pop(index)** elimină elementul de pe acea poziție din listă

**Afișarea tuturor sarcinilor**

```py
def displayTodos(todos):
    for i, task in enumerate(todos):
        status = "terminat" if task["done"] else "neterminat"
        print(f"{i}. [{status}] {task['nume']}")
```

---

Punând totul cap la cap

```py
todos = []

addTask(todos, "Termină curriculumul de Python")
addTask(todos, "Începe curriculumul de Java")
addTask(todos, "Ieși la aer")

displayTodos(todos)
print("---")

completeTask(todos, 0)
displayTodos(todos)
print("---")

removeTask(todos, 2)
displayTodos(todos)
```

Rezultat

```text
0. [neterminat] Termină curriculumul de Python
1. [neterminat] Începe curriculumul de Java
2. [neterminat] Ieși la aer
---
0. [terminat] Termină curriculumul de Python
1. [neterminat] Începe curriculumul de Java
2. [neterminat] Ieși la aer
---
0. [terminat] Termină curriculumul de Python
1. [neterminat] Începe curriculumul de Java
```

Fiecare funcție face **un singur lucru** și îl face bine. Acesta este un principiu de bază al programării bune. Funcțiile sunt mici, ușor de înțeles, și ușor de testat

---

O funcție de **numărare** este și ea utilă

```py
def countDone(todos):
    contor = 0
    for task in todos:
        if task["done"]:
            contor += 1
    return contor

def countNotDone(todos):
    return len(todos) - countDone(todos)
```

---

## Misiune: Tabla de Sarcini a Misiunii

Echipajul își urmărește munca pe o tablă de sarcini comună. Construiește funcțiile care o gestionează, apoi afișează tabla finalizată. Fiecare sarcină este un dicționar cu un `nume` și o stare `done`, iar tabla este o listă din aceste dicționare.

Scrie trei funcții:

- **add_task(tasks, nume)** — adaugă o sarcină nouă la listă cu `done` setat pe `False`.
- **complete_task(tasks, index)** — marchează sarcina de la acel index ca terminată.
- **count_done(tasks)** — returnează câte sarcini sunt terminate.

Codul de start din dreapta construiește deja tabla (adaugă trei sarcini, finalizează două dintre ele). După aceea, **afișează** tabla: pentru fiecare sarcină afișează indexul ei, apoi `. `, apoi `[terminat]` sau `[în așteptare]`, apoi numele sarcinii. La final afișează `Finalizat: ` urmat de numărul de sarcini terminate, un `/`, și totalul.

**Rezultat**

```text
0. [terminat] Rulează diagnoza
1. [în așteptare] Realimentează reactorul
2. [terminat] Trasează traseul
Finalizat: 2/3
```
