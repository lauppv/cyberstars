Nu toate procesele sunt la fel de importante. Mișcarea cursorului mouse-ului contează mai mult decât un backup care rulează noaptea. **Planificarea cu priorități** îi dă fiecărui proces un număr de prioritate, iar procesorul merge mereu la cel mai important proces gata de rulare. În exercițiile noastre, ca în Linux, un **număr mai mic înseamnă mai important**: prioritatea 1 o bate pe 5

---

Vom simula varianta cu preempțiune: planificatorul se uită din nou **la fiecare unitate de timp**. Dacă sosește un proces mai important cât rulează unul mai puțin important, cel care rulează e oprit pe loc și continuă mai târziu de unde a rămas

```text
nume  sosire  executie  prioritate
P1       0       4         3
P2       1       2         1
P3       2       2         2
```

```text
0-1 P1
1-3 P2
3-5 P3
5-8 P1
```

P1 pornește singur. La 1 sosește P2 cu prioritatea 1, mai important decât 3-ul lui P1, deci P2 preia procesorul și rulează până la capăt, la 3. Acum P3, cu prioritatea 2, îl bate pe P1. P1 termină în sfârșit de la 5 la 8

---

Cel mai ușor o simulăm câte o unitate de timp o dată

```text
for (int t = 0; terminate < n; t++) {
    int ales = -1;
    // dintre procesele sosite și neterminate, găsește prioritatea cea mai mică
    // rulează ales o unitate: ramas[ales]--
}
```

Pentru linia timpului nu afișăm fiecare unitate în parte. Ținem minte cine a rulat în ultima unitate, iar când rulează altcineva sau procesorul rămâne liber, afișăm bucata care tocmai s-a terminat

---

Planificarea cu priorități are același pericol ca SJF: **înfometarea**. Dacă tot vin procese importante, unul neimportant s-ar putea să nu ruleze niciodată. Sistemele adevărate repară asta prin **îmbătrânire** (aging): cu cât un proces așteaptă mai mult, cu atât devine mai important, până când își primește în sfârșit rândul

---

## Misiune: Priorități

Simulează planificarea cu priorități, cu preempțiune

1. Citește n, apoi n linii cu un nume, un timp de sosire, un timp de execuție și o prioritate
2. La fiecare unitate de timp, rulează procesul care a sosit, nu a terminat și are cel mai mic număr de prioritate. La priorități egale câștigă sosirea mai devreme, apoi cel venit primul la intrare. Dacă niciunul nu e gata, procesorul stă degeaba
3. Afișează linia timpului cu fiecare bucată unită, ca în exemplu, apoi timpii de așteptare și de răspuns ai fiecărui proces, în ordinea de la intrare, și cele două medii cu două zecimale

n e între 1 și 20. Numele au cel mult 7 caractere. Timpii de sosire sunt între 0 și 100, cei de execuție între 1 și 50, iar prioritățile între 1 și 10

**Exemplu**

Intrare

```text
3
P1 0 4 3
P2 1 2 1
P3 2 2 2
```

Ieșire

```text
0-1 P1
1-3 P2
3-5 P3
5-8 P1
P1: asteptare 4, raspuns 8
P2: asteptare 0, raspuns 2
P3: asteptare 1, raspuns 3
Asteptare medie: 1.67
Raspuns mediu: 4.33
```
