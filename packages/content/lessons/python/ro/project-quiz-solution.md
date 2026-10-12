```py
quiz = [
{"text": "Care comanda arata rezultatul?", "raspuns": "B"},
{"text": "Ce incepe un comentariu?", "raspuns": "C"},
{"text": "Ce returneaza len()?", "raspuns": "A"},
{"text": "Care cuvant-cheie defineste o functie?", "raspuns": "D"},
]
raspunsuri_jucator = ["B", "C", "A", "B"]

def noteaza_test(intrebari, raspunsuri):
    corecte = 0
    for i in range(len(intrebari)):
        if intrebari[i]["raspuns"] == raspunsuri[i]:
            corecte += 1
    return corecte

scor = noteaza_test(quiz, raspunsuri_jucator)
total = len(quiz)
procent = round(scor / total * 100)
print(f"Scor: {scor}/{total}")
print(f"Procentaj: {procent}%")
if procent >= 50:
    print("PASS")
else:
    print("FAIL")
```
