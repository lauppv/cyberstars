Combină **bucle for**, **bucle while** și **funcții**

---

## Misiune: Indicii despre Număr

Scrie o funcție `da_indicii(numar_secret)` care afișează **patru** indicii despre un număr, apoi cheam-o cu valoarea din `numar_secret`.

Indiciile, în ordine:

1. `Este par` sau `Este impar` (folosește `% 2`)
2. `Este mai mare ca 50` sau `Este 50 sau mai puțin`
3. `Suma cifrelor este` urmat de suma cifrelor numărului, calculată cu o **buclă while** (`% 10` îți dă ultima cifră, `// 10` o elimină). Pentru 73 asta înseamnă 7 + 3, deci `Suma cifrelor este 10`
4. `Este prim` sau `Nu este prim` — folosește o **buclă for** de la 2 până la număr, cu o variabilă flag, ca să verifici dacă ceva îl împarte exact

**Input** (deja setat la începutul codului tău — schimbă-l ca să testezi):

- `numar_secret` — numărul de analizat

**Exemplu**

Cu `numar_secret = 73`, programul tău ar trebui să afișeze

```text
Este impar
Este mai mare ca 50
Suma cifrelor este 10
Este prim
```
