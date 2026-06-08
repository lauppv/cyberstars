Până acum, toate valorile din programele noastre au fost scrise de noi, programatorul. Noi am ales **nume = "Tommy Vercetti"**, noi am ales **varsta = 42**. Dar ce-ar fi dacă vrem ca **utilizatorul** să aleagă? Ce-ar fi dacă vrem ca programul să ne întrebe ceva și să reacționeze în funcție de ce am tastat?

Aici intră în joc **input()**

```py
nume = input()
print(f"Salut, {nume}!")
```

**Rulăm** acest cod, tastăm ceva (de exemplu **Lance**) și apăsăm **Enter**. Programul va afișa

```text
Salut, Lance!
```

Programul s-a **oprit** și a **așteptat** după noi. În momentul în care **Python** vede **input()**, oprește programul și așteaptă ca utilizatorul să tasteze ceva. După ce apăsăm **Enter**, ce am tastat este stocat în variabila **nume**

Putem de asemenea să-i dăm utilizatorului un **indiciu** despre ce vrem să tasteze

```py
nume = input("Cum te cheamă? ")
print(f"Salut, {nume}!")
```

Acel mic mesaj din **input("...")** este afișat utilizatorului înainte ca programul să aștepte. Se numește **prompt**

---

Acum, iată ceva **chiar important**. Rulează acest cod

```py
varsta = input("Vârsta ta: ")
anul_urmator = varsta + 1
print(anul_urmator)
```

Vei primi o eroare. **De ce?** Pentru că **input() returnează întotdeauna un șir de caractere (string)**, chiar dacă utilizatorul tastează numere. Deci **varsta** este **"18"** (text), nu **18** (număr). Și nu putem face **"18" + 1**, deoarece unul este text și celălalt este număr

Ca să rezolvăm asta, îi spunem lui **Python**: „salut, ia acest text și transformă-l într-un număr"

```py
varsta = int(input("Vârsta ta: "))
anul_urmator = varsta + 1
print(anul_urmator)
```

**int()** este o funcție care convertește textul într-un **întreg** (un număr întreg). Acum **varsta** este cu adevărat **18**, și **18 + 1 = 19** funcționează perfect

Dacă utilizatorul a tastat ceva cu zecimale precum **1.75**, am folosi **float()** în schimb

```py
inaltime = float(input("Înălțimea ta: "))
print(inaltime)
```

---

## Misiune: Înregistrarea Echipajului

Stația spațială înregistrează fiecare nou membru al echipajului. Scrie un program care **întreabă** numele membrului echipajului, apoi vârsta lui, și afișează un mesaj de bun venit.

Ține minte că **input()** returnează întotdeauna un **șir de caractere (string)**, așa că trebuie să transformi vârsta într-un număr cu **int()** înainte să poți să-i aduni **1**.

**Input** (tastat de utilizator când rulează programul):

- numele membrului echipajului
- vârsta membrului echipajului

**Output**

O linie: `Bun venit la bord, ` apoi numele, apoi `! Ai ` vârsta, apoi `. Anul viitor vei avea ` vârsta plus unu, apoi un `.`

**Exemplu**

Dacă utilizatorul tastează

```text
Cortez
60
```

programul ar trebui să afișeze

```text
Bun venit la bord, Cortez! Ai 60. Anul viitor vei avea 61.
```
