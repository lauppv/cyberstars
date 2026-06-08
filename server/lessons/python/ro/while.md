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

**la nesfârșit**. Asta se numește **buclă infinită**. **Rulează** codul de mai sus ca să vezi ce se afișează, ca să vezi ce face programul **:)**

---

## Misiune: Descărcarea Bateriei

Stația funcționează pe o baterie care pierde din încărcare la fiecare ciclu. Ți se dau încărcarea de start `charge` (în procente) și cât pierde per ciclu, `drain`.

Scrie un program care folosește o buclă **while** ca să continue să ruleze **atâta timp cât** `charge` este mai mare decât **0**. La fiecare ciclu:

- dacă `charge` este **20 sau mai puțin** → afișează încărcarea, apoi `% - ENERGIE SCĂZUTĂ` (de exemplu `10% - ENERGIE SCĂZUTĂ`)
- altfel → afișează încărcarea, apoi `%` (de exemplu `70%`)

apoi reduce `charge` cu `drain`. Când bateria se golește în cele din urmă, afișează `Baterie descărcată` o singură dată la final.

**Atenție** — exact ca în lecția de mai sus, dacă uiți să scazi `charge` vei rămâne blocat într-o **buclă infinită** :)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `charge` — nivelul de start al bateriei în procente
- `drain` — cât din încărcare se pierde per ciclu

**Exemplu**

Cu `charge = 100` și `drain = 30`, programul tău ar trebui să afișeze

```text
100%
70%
40%
10% - ENERGIE SCĂZUTĂ
Baterie descărcată
```
