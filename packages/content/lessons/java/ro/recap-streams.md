Folosește împreună lambda-uri, un stream cu filter, sorted și map, un collect și un Optional

---

## Misiune: Echipa pentru Lovitură

Tommy are nevoie de o echipă pentru o treabă mare. Toți cei care vor să intre au dat un test și fiecare a primit un scor de pricepere. Tommy îi angajează doar pe cei cu un scor de cel puțin un minim

Numele sunt într-un array `String[] nume`, iar scorurile într-un array `int[] scoruri`. `nume[i]` a luat `scoruri[i]`. Minimul e în `int minim`. Afișează trei rânduri:

- `Angajati: ` și oamenii angajați, de la scorul cel mai mare la cel mai mic, despărțiți de o virgulă și un spațiu. Cei cu același scor păstrează ordinea din array-uri. Dacă nu e angajat nimeni, afișează `Angajati: nimeni`
- `Pricepere totala: ` și suma scorurilor celor angajați
- `Cel mai bun: ` și angajatul cu scorul cel mai mare, sau `Cel mai bun: nimeni`. Dacă mai mulți au scorul cel mai mare, alege-l pe primul din array-uri

**Exemplu**

```text
Angajati: Mitch, Lance, Earnest, Phil
Pricepere totala: 330
Cel mai bun: Mitch
```

**Exemplu**

```text
Angajati: nimeni
Pricepere totala: 0
Cel mai bun: nimeni
```
