Pune record-urile, compoziția, equals și clasele anonime să lucreze împreună într-un singur program

---

## Misiune: Showroom-ul auto

Tommy deschide Sunshine Autos, un showroom auto. Construiește-l:

* un record `Masina` cu un `String model` și un `int pret`
* o interfață `Pretuire` cu o singură metodă, `int pretFinal(int pret)`
* o clasă `Showroom` care își ține mașinile într-un `ArrayList<Masina>`. Dă-i o metodă `adauga(Masina masina)` și o metodă `vinde(String model)` care scoate prima mașină cu acel model și o dă înapoi, sau dă înapoi `null` când nu există niciuna

În `main`, stochează modelele într-un array de `String` numit `modele` și prețurile lor într-un array de `int` numit `preturi`, în aceeași ordine, și adaugă fiecare mașină în showroom. Stochează modelele pe care vor oamenii să le cumpere, în ordine, într-un array de `String` numit `comenzi`, iar reducerea din seara asta, în procente, într-un `int` numit `reducere`.

Fă o `Pretuire` cu o clasă anonimă care scade reducerea dintr-un preț: `pret * (100 - reducere) / 100`, fără zecimale. Apoi, pentru fiecare comandă:

* dacă showroom-ul are acel model, vinde-l și afișează `Vandut <model> cu <pretul final>`
* dacă nu, afișează `<model>: nu e in stoc`

La final, afișează `Ramase: ` urmat de lista mașinilor rămase în showroom, cum o afișează ArrayList-ul, și `Valoarea stocului: N`, suma prețurilor lor întregi.

**Exemplu** pentru `modele = { "Infernus", "Cheetah", "Infernus" }`, `preturi = { 1000, 800, 900 }`, `comenzi = { "Infernus", "Banshee" }` și `reducere = 10`

```text
Vandut Infernus cu 900
Banshee: nu e in stoc
Ramase: [Masina[model=Cheetah, pret=800], Masina[model=Infernus, pret=900]]
Valoarea stocului: 1700
```

**Exemplu** pentru `modele = { "Stinger" }`, `preturi = { 500 }`, `comenzi = { "Stinger", "Stinger" }` și `reducere = 0`

```text
Vandut Stinger cu 500
Stinger: nu e in stoc
Ramase: []
Valoarea stocului: 0
```
