Blocarea în ordine previne deadlock-urile între mutex-uri. Dar un sistem de operare împarte multe feluri de resurse: unități de bandă, imprimante, memorie. Unele sisteme sunt prudente: înainte să-i dea unui proces ce cere, verifică dacă sistemul ar putea termina totuși **fiecare** proces după aceea. Dacă nu, procesul așteaptă, chiar dacă resursele sunt libere. Metoda clasică pentru această verificare e **algoritmul bancherului**, numit după un bancher care nu împrumută niciodată bani în așa fel încât să rămână fără să-i poată plăti pe toți înapoi

---

Sistemul ține câteva tabele. Cu n procese și m feluri de resurse

- **Available** (disponibil): câte din fiecare fel sunt libere acum
- **Max**: cel mai mult din fiecare fel de care ar putea avea nevoie vreodată fiecare proces. Fiecare proces spune asta când pornește
- **Allocation** (alocat): câte din fiecare fel ține acum fiecare proces
- **Need** (nevoie) = Max - Allocation: câte mai poate cere fiecare proces

O stare e **sigură** dacă există o ordine în care fiecare proces poate primi tot ce îi mai trebuie, se poate termina și poate da totul înapoi

---

Verificarea siguranței joacă asta până la capăt

1. Work pornește ca o copie a lui Available. Niciun proces nu e încă terminat
2. Găsește un proces care nu e terminat și al cărui Need încape în Work, pentru fiecare fel de resursă
3. Prefă-te că rulează până la capăt: dă înapoi ce ține, deci Work crește cu Allocation-ul lui. Marchează-l ca terminat
4. Întoarce-te la pasul 2. Dacă se termină fiecare proces, starea e sigură, iar ordinea găsită e o **secvență sigură**. Dacă rămânem blocați cu unele neterminate, e nesigură

Un exemplu mic, cu un singur fel de resursă, 2 libere

```text
         Max  Allocation  Need
P0        5       3         2
P1        4       2         2
```

Work e 2. P0 are nevoie de 2: încape. P0 se termină și dă înapoi 3, deci Work e 5. Acum P1 are nevoie de 2: încape și el. Secvența sigură: P0 P1

---

Când un proces cere resurse, sistemul verifică trei lucruri

1. Cererea e mai mare decât Need-ul procesului? Atunci e o **eroare**: procesul și-a încălcat promisiunea
2. E mai mare decât Available? Atunci procesul trebuie să **aștepte**: nu e destul acum
3. Altfel, prefă-te că i-o dai: Available scade, Allocation-ul procesului crește, iar Need-ul lui scade. Rulează verificarea siguranței. Dacă noua stare e sigură, cererea e **acceptată** și rămâne. Dacă nu, anulează totul, iar procesul așteaptă

O stare poate fi nesigură fără să fie încă un deadlock. Nesigur înseamnă doar că un deadlock **s-ar putea** întâmpla dacă procesele cer tot ce e mai rău. Bancherul nu-și asumă niciodată riscul ăsta

---

## Misiune: Bancherul

Centrul de calcul își împarte resursele cu algoritmul bancherului. Verifică starea de început, apoi răspunde la o listă de cereri, una după alta

1. Citește n și m. Apoi Available, m numere. Apoi Max, n rânduri a câte m numere. Apoi Allocation, n rânduri a câte m numere. Calculează Need
2. Rulează verificarea siguranței. Când mai multe procese ar putea fi următoarele, alege-l mereu pe cel cu numărul cel mai mic, iar după fiecare proces terminat începe să cauți din nou de la P0. Afișează `Sigur:` și secvența, sau `Nesigur`
3. Apoi citește cereri până se termină datele: un număr de proces și m numere. Răspunde la fiecare cu o linie, ca în exemplu: `acceptata`, `asteapta`, `nesigur` sau `eroare`. O cerere acceptată schimbă tabelele pentru următoarele. Una care nu e acceptată nu schimbă nimic

n e între 1 și 8, m între 1 și 4, iar fiecare număr între 0 și 20. Dacă starea de început e nesigură, nu există cereri

**Exemplu**

Intrare

```text
5 3
3 3 2
7 5 3
3 2 2
9 0 2
2 2 2
4 3 3
0 1 0
2 0 0
3 0 2
2 1 1
0 0 2
1 1 0 2
4 3 3 0
0 0 2 0
1 0 3 0
```

Ieșire

```text
Sigur: P1 P3 P0 P2 P4
P1 1 0 2: acceptata
P4 3 3 0: asteapta
P0 0 2 0: nesigur
P1 0 3 0: eroare
```

După ce prima cerere e acceptată, Available e 2 3 0. P4 cere 3 din primul fel, dar doar 2 sunt libere. Cererea lui P0 încape, dar după ea niciun proces nu s-ar mai putea termina. P1 mai are nevoie doar de 0 2 0, deci cererea a 3 din al doilea fel îi încalcă promisiunea
