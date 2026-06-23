În lecția anterioară am învățat ce este o buclă **for**. Putem face calculatorul să facă lucruri de mai multe ori, **automat**. Totuși, nu ar fi util să-i spunem calculatorului să facă ceva atâta timp cât… ceva? Ei bine, da, asta este posibil. Aici intervine bucla **while**

```py
i = 0
while i < 10:
    print(i)
    i = i + 1
```

acest cod va afișa

```text
0
1
2
3
4
5
6
7
8
9
```

De ce nu și **10**? Pentru că dacă **i = 10**, atunci **i < 10 NU este adevărat**, deoarece **10 NU este mai mic decât 10**

```py
i = 0
while i <= 10:
    print(i)
    i = i + 1

```

De fapt, vom avea toate numerele de la **0 la 10 inclusiv**, pentru că **10 <= 10 este adevărat**

Cu alte cuvinte, **while** rulează atâta timp cât condiția este **adevărată**

**Atenție**! Dacă nu scriem **i = i + 1**, intrăm într-o **buclă infinită**

```py
i = 0
while i <= 100:
    print(i)
```

Pentru că **i rămâne 0**, prin urmare **print(i)** va afișa mereu **0**. Cum **i <= 100** este mereu **adevărat** în acest caz **(0 <= 100 mereu)**, programul va afișa

```text
0
0
0
0
0
...
```

**la nesfârșit**. Asta se numește **buclă infinită**

---

## Oprim bucla cu input()

Bucla **while** devine cu adevărat puternică împreună cu **input()**. Putem cere ceva utilizatorului **din nou și din nou**, până când ne dă răspunsul pe care îl așteptăm

Imaginează-ți că stația cere o parolă. Vrem să tot întrebăm **cât timp** parola este greșită

```py
parola = ""
while parola != "steluta":
    parola = input("Parola: ")
print("Acces permis!")
```

Hai să urmărim ce se întâmplă:

- la început **parola = ""** (gol), deci **parola != "steluta"** este adevărat → intrăm în buclă
- programul ne cere parola. Dacă tastăm **luna**, atunci **parola = "luna"**, încă diferit de **"steluta"** → bucla se repetă și ne cere din nou
- dacă tastăm **steluta**, atunci **parola = "steluta"**, deci **parola != "steluta"** devine **fals** → bucla se oprește
- programul afișează **Acces permis!**

Observă lucrul important: aici **nu** știam de câte ori se va repeta bucla. Depinde complet de ce tastează utilizatorul. Cu un **for** ar fi fost greu, pentru că **for** vrea să știe de la început de câte ori să meargă. Cu **while** este natural — repetăm pur și simplu **cât timp** condiția este adevărată

De ce am pus **parola = ""** înainte de buclă? Ca **while** să aibă ce verifica la prima trecere. Dacă variabila nu ar exista deloc, **Python** ar da eroare când ajunge la condiție

---

## Misiune: Cod de acces

Stația cere un cod de acces înainte să deschidă ușa. Scrie un program care cere repetat un cod cu **input()**, **cât timp** codul tastat nu este cel corect. Codul corect este **1234**

- cât timp utilizatorul tastează un cod greșit → afișează `Cod greșit`
- când utilizatorul tastează codul corect → afișează `Acces permis` și bucla se oprește

**Exemplu**

Dacă utilizatorul tastează pe rând `1111`, apoi `2222`, apoi `1234`, programul afișează

```text
Cod gresit
Cod gresit
Acces permis
```
