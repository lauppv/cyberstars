Combină **interfețe**, **enum-uri** și **instanceof / casting**

---

## Misiune: Imperiul lui Tommy

Tommy vrea un inventar al imperiului său din Vice City. Are două tipuri de bunuri — afaceri și vehicule. Fiecare bun are un nume, o valoare în dolari și o stare dintr-un set fix de opțiuni. Vehiculele au în plus o viteză maximă

Construiește sistemul: o interfață comună `Bun` (metoda `afiseaza()`) pe care ambele tipuri o implementează, un enum `Stare` pentru stări, și clasele `Afacere` (nume, valoare, stare) și `Vehicul` (nume, valoare, stare, vitezaMaxima).

În `main`, stochează datele fiecărui bun în variabile — `nume1`/`valoare1` pentru prima afacere, `nume2`/`valoare2`/`viteza2` pentru primul vehicul, `nume3`/`valoare3` pentru a doua afacere, `nume4`/`valoare4`/`viteza4` pentru al doilea vehicul. Pune-le într-un tablou `Bun[]` (o `Afacere` din `nume1`/`valoare1`, un `Vehicul` din `nume2`/`valoare2`/`viteza2`, și așa mai departe — stările sunt `ACTIV`, `ACTIV`, `RENOVARE`, `INCHIS`), parcurge-l și afișează informațiile. La vehicule, folosește `instanceof` ca să afișezi și viteza maximă.

De exemplu, Malibu Club e o afacere activă care valorează $120000, Infernus e un vehicul activ de $150000 cu viteza maximă 240 km/h, Print Works e în renovare ($70000), iar Cheetah e un vehicul închis de $110000 cu 230 km/h

**Exemplu**

```text
Malibu Club - $120000 - activ
Infernus - $150000 - activ
Viteza maxima: 240 km/h
Print Works - $70000 - renovare
Cheetah - $110000 - inchis
Viteza maxima: 230 km/h
```
