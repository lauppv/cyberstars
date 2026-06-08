Hai să construim un **joc de tip quiz**! O să stocăm întrebări, răspunsuri posibile, și răspunsul corect într-o structură de date, apoi le parcurgem și ținem scorul

Acest proiect ne învață cum să **organizăm datele**, să le **parcurgem**, și să **urmărim starea** — abilități care apar în orice program real

---

Cum stocăm o întrebare de quiz? Un **dicționar** este perfect

```py
question = {
    "text": "Care este capitala statului din Vice City?",
    "options": ["A) New York", "B) Miami", "C) Los Angeles", "D) Chicago"],
    "answer": "B"
}
```

Și un quiz complet? O **listă de dicționare**

```py
quiz = [
    {
        "text": "Ce face print()?",
        "options": ["A) Citește input", "B) Afișează rezultatul", "C) Creează o variabilă", "D) Face bucle"],
        "answer": "B"
    },
    {
        "text": "Ce simbol se folosește pentru comentarii în Python?",
        "options": ["A) //", "B) /*", "C) #", "D) --"],
        "answer": "C"
    },
    {
        "text": "Ce returnează len()?",
        "options": ["A) Tipul", "B) Valoarea", "C) Lungimea", "D) Nimic"],
        "answer": "C"
    }
]
```

---

Acum hai să construim logica jocului

```py
scor = 0

for i, q in enumerate(quiz):
    print(f"\nÎntrebarea {i + 1}: {q['text']}")
    for option in q["options"]:
        print(f"  {option}")

    answer = input("Răspunsul tău (A/B/C/D): ").upper()

    if answer == q["answer"]:
        print("Corect!")
        scor += 1
    else:
        print(f"Greșit! Răspunsul era {q['answer']}")

print(f"\nAi obținut {scor}/{len(quiz)}")
```

Observă ce am folosit: **listă de dicționare**, **enumerate**, **bucle for**, **if/else**, **input**, **metode pe șiruri** (.upper()), **f-string-uri**, și **tiparul de contor**. Toate uneltele din acest curriculum, lucrând împreună

---

Hai să-l facem și mai bun cu o funcție

```py
def runQuiz(questions):
    scor = 0

    for i, q in enumerate(questions):
        print(f"\nÎntrebarea {i + 1}: {q['text']}")
        for option in q["options"]:
            print(f"  {option}")

        answer = input("Răspunsul tău: ").upper()

        if answer == q["answer"]:
            print("Corect!")
            scor += 1
        else:
            print(f"Greșit! Răspunsul era {q['answer']}")

    return scor, len(questions)

scor, total = runQuiz(quiz)
percentage = round(scor / total * 100)
print(f"\nScor final: {scor}/{total} ({percentage}%)")
```

---

## Misiune: Quiz-ul de Certificare al Echipajului

Echipajul nou trebuie să treacă un quiz de certificare. Întrebările și răspunsurile candidatului sunt deja înregistrate (în dreapta), așa că nu e nevoie de `input()` — tu doar evaluezi și raportezi.

1. Scrie o funcție **grade_quiz(questions, answers)** care returnează câte dintre răspunsurile candidatului se potrivesc cu câmpul `"answer"` al întrebării corespunzătoare.
2. Afișează `Scor: ` urmat de numărul de răspunsuri corecte, un `/`, și numărul total de întrebări.
3. Afișează `Procentaj: ` urmat de scor ca procentaj cu număr întreg (folosește `round(scor / total * 100)`), apoi un `%`.
4. Afișează `PASS` dacă procentajul este `50` sau mai mare, altfel `FAIL`.

**Rezultat**

```text
Scor: 3/4
Procentaj: 75%
PASS
```
