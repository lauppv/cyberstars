Combină **if/elif/else**, **valori booleene** și **operații matematice**

---

## Misiune: Casa de Bilete

Construiește un **calculator de preț al biletelor** pentru cinematograful stației.

Un bilet are prețul standard de 10 EUR (adică prețul întreg, fără reducere). În funcție de vârsta clientului se pot aplica reduceri astfel:

- sub **6** ani → reducere **10 EUR** (gratis)
- **6 până la 12 ani** → reducere **5 EUR**
- **13 până la 17 ani** → reducere **3 EUR**
- **18 până la 64 ani** → reducere **0 EUR**
- **65 ani și peste** → reducere **4 EUR**

Dacă filmul este 3D, se adaugă o taxă de **2 EUR**

Trebuie să afișezi prețul final al biletului

**Exemplu**

Pentru un client de **8 ani** la un film **3D**, programul tău ar trebui să afișeze

```text
Preț standard: 10 EUR
Reducere: 5 EUR
Taxa 3D: 2 EUR
Total: 7 EUR
```

(10 − 5 = 5, plus 2 EUR pentru 3D, deci 7 EUR)

Acum încearcă un client de **30 de ani** la un film care **nu e 3D**

```text
Preț standard: 10 EUR
Reducere: 0 EUR
Total: 10 EUR
```

Sau un client de **70 de ani** la un film **3D**

```text
Preț standard: 10 EUR
Reducere: 4 EUR
Taxa 3D: 2 EUR
Total: 8 EUR
```

Și un client de **4 ani** la un film care **nu e 3D**

```text
Preț standard: 10 EUR
Reducere: 10 EUR
Total: 0 EUR
```
