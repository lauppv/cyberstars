Combină **getteri/setteri**, **toString**, **cuvântul-cheie static**, și **cuvântul-cheie final**

---

## Misiune: Registrul de Credite al Stației

Stația funcționează pe o economie bazată pe credite. Fiecare membru al echipajului are un cont gestionat de registrul central. Construiește sistemul de conturi cu o încapsulare corectă, ca nimeni să nu poată modifica soldurile direct.

Creează o clasă **`ContBancar`** cu:

- câmpuri **private**: `proprietar` (String), `sold` (double), `idCont` (int)
- Un **`private static int urmatorulId`** = 1 (ține evidența următorului ID de atribuit)
- Un **`final double SOLD_MINIM`** = 0.0 (nu poate coborî sub zero)
- **Constructor** care primește proprietar și soldul inițial. Atribuie automat `idCont` din `urmatorulId` și îl incrementează
- **Getteri** pentru proprietar, sold, și idCont
- **`depune(double suma)`** — adaugă la sold
- **`retrage(double suma)`** — scade dacă sold rămâne >= SOLD_MINIM, altfel afișează `"Fonduri insuficiente"`
- **`toString()`** — returnează `"Cont #X (Proprietar) - Sold: Y EUR"`
- **`static int getTotalConturi()`** — returnează câte conturi au fost create

Apelurile de test din main sunt deja în dreapta.

**Output**

```text
Fonduri insuficiente
Cont #1 (Tommy) - Sold: 1250.0 EUR
Cont #2 (Lance) - Sold: 300.0 EUR
Total conturi: 2
```
