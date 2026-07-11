Combină **getteri/setteri**, **toString**, **cuvântul-cheie static**, și **cuvântul-cheie final**

---

## Misiune: Conturile lui Tommy

Tommy ține banii bandei la bancă, iar fiecare membru are propriul cont. Construiește sistemul de conturi cu o încapsulare corectă, ca nimeni să nu poată modifica soldurile direct.

Creează o clasă **`ContBancar`** cu:

- câmpuri **private**: `proprietar` (String), `sold` (int), `idCont` (int)
- un **`private static int urmatorulId`** = 1 (ține evidența următorului ID de atribuit)
- un **`final int SOLD_MINIM`** = 0 (soldul nu poate coborî sub zero)
- un **constructor** care primește proprietarul și soldul inițial; atribuie automat `idCont` din `urmatorulId` și îl incrementează
- **getteri** pentru proprietar, sold și idCont
- **`depune(int suma)`** — adaugă la sold
- **`retrage(int suma)`** — scade doar dacă soldul rămâne >= `SOLD_MINIM`, altfel afișează `"Fonduri insuficiente"`
- **`toString()`** — returnează `"Cont #X (Proprietar) - Sold: Y$"`
- **`static int getTotalConturi()`** — returnează câte conturi au fost create

În `main`, stochează detaliile în variabile — `proprietar1`/`sold1` pentru primul cont și `proprietar2`/`sold2` pentru al doilea; `depunere1` pentru depunerea în primul cont și `retragere1`/`retragere2` pentru cele două retrageri din al doilea. Creează cele două conturi, apoi: depune `depunere1` în primul, retrage `retragere1` din al doilea și retrage `retragere2` din al doilea (aceasta poate eșua, ca să vezi mesajul). Apoi afișează ambele conturi și totalul

**Exemplu** — Tommy deschide cu 1000 și depune 250; Lance deschide cu 500, retrage 200, apoi încearcă să retragă 400 (eșuează)

```text
Fonduri insuficiente
Cont #1 (Tommy) - Sold: 1250$
Cont #2 (Lance) - Sold: 300$
Total conturi: 2
```
