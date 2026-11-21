Pune împreună `import` și modulele math, random, collections și datetime

---

## Misiune: Planificatorul de lansări

Mai multe nave așteaptă să plece de pe stație, câte o lansare pe zi. Ordinea e trasă la sorți, de la un seed, ca planul să poată fi verificat mai târziu. Fiecare zbor durează un număr de ore care depinde de distanța lui

1. Începe programul cu patru variabile: **seed**, un număr întreg, **start**, un string cu prima zi de lansare ca `"2031-05-14"`, **nave**, o listă de nume, și **distante**, o listă de numere întregi: distanța fiecărei nave în kilometri, în aceeași ordine ca numele. De exemplu `seed = 5`, `start = "2031-05-14"`, `nave = ["Speranta", "Fulger", "Bob"]` și `distante = [7000, 3000, 9500]`
2. Fixează seed-ul cu `random.seed(seed)`, apoi trage ordinea lansărilor cu un singur apel: `random.sample(nave, len(nave))`
3. Pentru fiecare navă în această ordine, afișează o linie: data lansării ei ca ziua cu două cifre și numele scurt al lunii, ca `14 May`, apoi `: `, nava, `, `, orele zborului ei și ` h`. Prima navă pleacă în ziua de start, următoarea o zi mai târziu și tot așa. Un zbor durează o oră pentru fiecare 3000 km, iar o parte de oră se socotește o oră întreagă
4. Afișează `Total: ` și orele tuturor zborurilor adunate, apoi ` h`
5. Afișează `Cel mai des: `, numărul de ore care apare cel mai des, un spațiu, `h,` și un spațiu, și câte zboruri durează atât. Dacă mai multe apar la fel de des, ia-l pe cel care vine primul în ordinea lansărilor

Folosește `math`, `random`, `collections` și `datetime`. Sunt între 1 și 10 nave, cu nume diferite, iar fiecare distanță e de la 1 la 50000 km. `%b` în `strftime()` dă numele scurt al lunii, în engleză

**Exemplu** pentru valorile de mai sus

```text
14 May: Bob, 4 h
15 May: Fulger, 1 h
16 May: Speranta, 3 h
Total: 8 h
Cel mai des: 4 h, 1
```
