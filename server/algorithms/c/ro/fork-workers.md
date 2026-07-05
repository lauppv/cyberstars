# Ușor · Mai mulți copii

Un centru de calcul primește un ordin de execuție care specifică câte procese copii să lanseze. Fiecare copil raportează că e gata, iar părintele confirmă la final că toți au terminat.

Fiecare iterație a buclei apelează **fork()**. În copil, tipărim mesajul și **ieșim imediat** — dacă nu ieșim, copilul continuă bucla și creează la rândul lui alte forkuri, exponențial.

### Date de intrare

- Linia 1: numărul întreg `N` (1 ≤ N ≤ 5)

### Rezultat

- N linii de forma `Copil K gata` unde K este indicele copilului (1 până la N). Ordinea acestor linii poate varia — procesele rulează concurent.
- Ultima linie: `Toti copiii au terminat`.

Mesajul final trebuie să apară întotdeauna ultimul, pentru că părintele așteaptă cu **wait(NULL)** toți copiii înainte să-l tipărească.

### Exemple

```
Intrare:
3
Ieșire:
Copil 1 gata
Copil 2 gata
Copil 3 gata
Toti copiii au terminat
```

Ordinea celor N linii `Copil K gata` poate varia (de exemplu, `Copil 2 gata` poate apărea primul); linia de final rămâne mereu ultima.

Folosește **fork()** într-o buclă și **wait(NULL)** de N ori pentru a aștepta toți copiii.
