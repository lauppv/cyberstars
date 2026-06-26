Hai să construim un **joc de tip quiz**! O să stocăm întrebări, răspunsuri posibile, și răspunsul corect într-o structură de date, apoi le parcurgem și ținem scorul

Acest proiect ne învață cum să **organizăm datele**, să le **parcurgem**, și să **urmărim starea** — abilități care apar în orice program real

---

Cum stocăm o întrebare de quiz? Un **dicționar** este perfect

```py
intrebare = {
    "text": "Care este capitala statului din Vice City?",
    "optiuni": ["A) New York", "B) Miami", "C) Los Angeles", "D) Chicago"],
    "raspuns": "B"
}
```

Și un quiz complet? O **listă de dicționare**

```py
quiz = [
    {
        "text": "Ce face print()?",
        "optiuni": ["A) Citeste input", "B) Afiseaza rezultatul", "C) Creeaza o variabila", "D) Face bucle"],
        "raspuns": "B"
    },
    {
        "text": "Ce simbol se foloseste pentru comentarii in Python?",
        "optiuni": ["A) //", "B) /*", "C) #", "D) --"],
        "raspuns": "C"
    },
    {
        "text": "Ce returneaza len()?",
        "optiuni": ["A) Tipul", "B) Valoarea", "C) Lungimea", "D) Nimic"],
        "raspuns": "C"
    }
]
```

---

Acum hai să construim logica jocului

```py
scor = 0

for i, q in enumerate(quiz):
    print(f"\nIntrebarea {i + 1}: {q['text']}")
    for optiune in q["optiuni"]:
        print(f"  {optiune}")

    raspuns = input("Raspunsul tau (A/B/C/D): ").upper()

    if raspuns == q["raspuns"]:
        print("Corect!")
        scor += 1
    else:
        print(f"Gresit! Raspunsul era {q['raspuns']}")

print(f"\nAi obtinut {scor}/{len(quiz)}")
```

Observă ce am folosit: **listă de dicționare**, **enumerate**, **bucle for**, **if/else**, **input**, **metode pe șiruri** (.upper()), **f-string-uri**, și **tiparul de contor**. Toate uneltele din acest curriculum, lucrând împreună

---

Hai să-l facem și mai bun cu o funcție

```py
def ruleaza_test(intrebari):
    scor = 0

    for i, q in enumerate(intrebari):
        print(f"\nIntrebarea {i + 1}: {q['text']}")
        for optiune in q["optiuni"]:
            print(f"  {optiune}")

        raspuns = input("Raspunsul tau: ").upper()

        if raspuns == q["raspuns"]:
            print("Corect!")
            scor += 1
        else:
            print(f"Gresit! Raspunsul era {q['raspuns']}")

    return scor, len(intrebari)

scor, total = ruleaza_test(quiz)
procent = round(scor / total * 100)
print(f"\nScor final: {scor}/{total} ({procent}%)")
```

---

## Misiune: Quiz-ul de Certificare al Echipajului

Echipajul nou trebuie să treacă un quiz de certificare. Întrebările și răspunsurile candidatului sunt deja înregistrate, așa că nu e nevoie de `input()` — tu doar evaluezi și raportezi.

1. Scrie o funcție **noteaza_test(intrebari, raspunsuri)** care returnează câte dintre răspunsurile candidatului se potrivesc cu câmpul `"raspuns"` al întrebării corespunzătoare.
2. Afișează `Scor: ` urmat de numărul de răspunsuri corecte, un `/`, și numărul total de întrebări.
3. Afișează `Procentaj: ` urmat de scor ca procentaj cu număr întreg (folosește `round(scor / total * 100)`), apoi un `%`.
4. Afișează `PASS` dacă procentajul este `50` sau mai mare, altfel `FAIL`.

**Ieșire**

```text
Scor: 3/4
Procentaj: 75%
PASS
```
