O școală are `n` cursuri, numerotate de la `0` la `n - 1`, și câteva reguli: o regulă `u v` spune că un elev trebuie să facă întâi cursul `u` și abia apoi cursul `v`. Afișează o ordine care trece o dată prin fiecare curs și respectă toate regulile. Când mai multe cursuri pot urma, ia-l mereu pe cel cu numărul cel mai mic, ca să fie o singură ordine corectă. Dacă regulile se închid într-un cerc, nicio ordine nu merge: afișează `-1`.

### Cum se scriu regulile

Pe prima linie sunt numărul de cursuri `n` și numărul de reguli `m`. Urmează `m` linii, câte o regulă `u v` pe fiecare. E un graf orientat: fiecare regulă e o muchie de la `u` la `v` și merge doar în sensul acela.

```
3 --> 1 --> 0
2 --> 4 --> 0
```

Acestea sunt regulile din primul exemplu de mai jos: `3` vine înainte de `1`, `1` înainte de `0`, `2` înainte de `4` și `4` înainte de `0`.

Partea ascunsă a programului citește deja regulile în `vecini`, unde `vecini.get(u)` are cursurile care au nevoie întâi de `u`, apoi afișează lista întoarsă de `ordineCursuri`, sau `-1` când e goală. Tu scrii `ordineCursuri`, care întoarce ordinea, sau o listă goală când nu există una.

### Date de intrare

- Linia 1: `n` și `m`. Sunt între 1 și 500 de cursuri și cel mult 2000 de reguli.
- Următoarele `m` linii: regulile. Nicio regulă nu pune un curs înaintea lui însuși și nicio regulă nu e scrisă de două ori.

### Rezultat

Cursurile în ordine, despărțite de câte un spațiu, sau `-1`.

### Exemple

```
Intrare:
5 4
3 1
1 0
2 4
4 0

Ieșire:
2 3 1 4 0
```

La început `2` și `3` sunt libere, iar `2` e mai mic. După `2` și `3`, sunt libere și `1`, și `4`, așa că `1` vine primul. `0` le așteaptă pe amândouă.

```
Intrare:
3 3
0 1
1 2
2 0

Ieșire:
-1
```

Fiecare curs îl așteaptă pe altul, în cerc.

```
Intrare:
3 0

Ieșire:
0 1 2
```
