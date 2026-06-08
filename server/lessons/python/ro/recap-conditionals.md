Combină **if/else**, **if/elif/else** și **comentarii**

---

## Misiune: Casa de Bilete

Construiește un **calculator de preț al biletelor** pentru cinematograful stației. Vârsta clientului `varsta` și dacă filmul e `is_3d` sunt setate în partea de sus a codului tău.

Preț de bază în funcție de vârstă:

- sub **6** → **0 EUR** (gratis)
- **6 până la 12** → **5 EUR**
- **13 până la 17** → **8 EUR**
- **18 până la 64** → **12 EUR**
- **65 și peste** → **6 EUR** (reducere pentru seniori)

Afișează prețul de bază de genul `Preț de bază: 8 EUR`. Dacă `is_3d` este True, adaugă **3 EUR** la total și afișează și `Supliment 3D: 3 EUR`. La final, afișează totalul de genul `Total: 11 EUR` (dacă nu e 3D, totalul e doar prețul de bază).

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `varsta` — vârsta clientului
- `is_3d` — `True` pentru un film 3D

**Exemplu**

Cu `varsta = 15` și `is_3d = True`, programul tău ar trebui să afișeze

```text
Preț de bază: 8 EUR
Supliment 3D: 3 EUR
Total: 11 EUR
```

Acum setează `varsta = 70` și `is_3d = False` și rulează din nou

```text
Preț de bază: 6 EUR
Total: 6 EUR
```
