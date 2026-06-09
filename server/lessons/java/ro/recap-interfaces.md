Combină **interfețe**, **conversia de tip (casting)**, **excepții** și **String.format**

---

## Misiune: Scaner de Geometrie a Cocăi

Scanerul de integritate al cocăi stației detectează formele structurale și le calculează aria pentru analiza de stres. Construiește sistemul de forme folosind interfețe, apoi demonstrează conversia de tip sigură cu tratarea excepțiilor.

Creează o interfață **`Forma`** cu:

- `double arie()`
- `String descrie()`

Creează trei clase care implementează Forma:

- **Cerc** — primește raza. Aria = PI _ r _ r. descrie returnează `"Cerc (r=X.X)"`
- **Dreptunghi** — primește lățimea și înălțimea. Aria = w \* h. descrie returnează `"Dreptunghi (X.X x X.X)"`
- **Triunghi** — primește baza și înălțimea. Aria = 0.5 _ b _ h. descrie returnează `"Triunghi (b=X.X, h=X.X)"`

Metoda `afiseazaForma` și tabloul de forme sunt deja pregătite în dreapta. După ce afișezi toate formele, convertește `forme[0]` la Cerc și afișează-i raza, apoi încearcă să convertești `forme[1]` la Cerc și prinde excepția `ClassCastException`.

**Output**

```text
Cerc (r=5.0) — Arie: 78.54
Dreptunghi (4.0 x 6.0) — Arie: 24.00
Triunghi (b=3.0, h=8.0) — Arie: 12.00
Raza cercului: 5.0
Nu e un cerc!
```
