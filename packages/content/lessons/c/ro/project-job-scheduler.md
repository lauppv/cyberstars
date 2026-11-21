Ultimul proiect pune thread-urile la muncă așa cum o fac serverele: un **pool de thread-uri** (thread pool). Să pornești un thread nou pentru fiecare lucrare mică e lent. În schimb, câteva thread-uri lucrătoare pornesc o singură dată și tot iau lucrări dintr-o coadă comună până nu mai rămâne nimic. Vei folosi ce ai construit în lecțiile despre thread-uri: un mutex, variabile de condiție, o coadă limitată și rezultate pentru fiecare lucrare

Aici nu e cod de copiat, doar un plan

---

**Părțile**

- Un tabel de lucrări, umplut de main din datele de intrare. Fiecare lucrare are un nume, un număr de prelucrat și un loc pentru rezultat
- O **coadă limitată** de numere de lucrări, un buffer circular ca banda rulantă, păzit de un mutex și două variabile de condiție
- W thread-uri lucrătoare. Fiecare repetă: ia un număr de lucrare din coadă, face lucrarea, scrie rezultatul în locul acelei lucrări din tabel

---

**Oprirea lucrătorilor.** Când main a pus fiecare lucrare în coadă, lucrătorii trebuie să afle că nu mai vine nimic. O cale simplă e câte o santinelă pentru fiecare lucrător: main pune -1 în coadă de W ori. Un lucrător care ia -1 se oprește. Fiindcă fiecare lucrător ia exact un -1, se opresc toți

---

**De ce sunt previzibile rezultatele.** Ce lucrător ia ce lucrare se schimbă de la o rulare la alta, la fel și ordinea în care se termină lucrările. Dar fiecare lucrare scrie doar în locul ei din tabel, iar main afișează tabelul în ordine după ce i-a așteptat pe toți lucrătorii. Așa că ieșirea e aceeași de fiecare dată. Nu-i lăsa pe lucrători să afișeze nimic

---

Lucrarea însăși e să numere numerele prime de la 2 până la limita lucrării. Unele limite sunt mari, deci mai mulți lucrători chiar ajută

---

## Misiune: Planificatorul de lucrări

1. Citește W, numărul de lucrători, și Q, locul din coadă. Apoi citește lucrări până se termină datele: un nume și o limită
2. Pornește W thread-uri lucrătoare. Apoi pune numărul fiecărei lucrări în coada limitată, în ordinea de la intrare, așteptând cât timp e plină. Apoi pune W santinele
3. Fiecare lucrător ia numere de lucrări din coadă, așteptând cât timp e goală. Pentru o lucrare, numără numerele prime până la limită și salvează rezultatul în intrarea lucrării din tabel. Pentru o santinelă, se oprește
4. main îi așteaptă pe toți lucrătorii, apoi afișează fiecare lucrare cu rezultatul ei, în ordinea de la intrare, apoi câte lucrări au fost și totalul tuturor rezultatelor, ca în exemplu

W e între 1 și 4, iar Q între 1 și 5. Numele au cel mult 15 caractere. Sunt între 1 și 100 de lucrări, iar fiecare limită e între 1 și 50000

**Exemplu**

Intrare

```text
2 2
census 100
orbit 10
payroll 1000
tiny 1
```

Ieșire

```text
census: 25
orbit: 4
payroll: 168
tiny: 0
Lucrari: 4, total: 197
```
