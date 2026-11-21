FIFO dă afară pagina cea mai veche, chiar și când e folosită tot timpul. O ghicire mai bună despre viitor e trecutul apropiat: o pagină folosită acum o clipă va fi probabil folosită din nou curând. **LRU**, „least recently used”, adică folosită cel mai demult, dă afară pagina care a stat cel mai mult timp **nefolosită**

---

Ca să știm asta, ținem minte pentru fiecare cadru **când a fost folosită ultima dată pagina lui**: un contor care crește la fiecare acces. La o găsire, timpul paginii se reîmprospătează. La o eroare cu toate cadrele pline, victima e cadrul cu timpul cel mai mic

Aceleași pagini ca în lecția despre FIFO, 3 cadre

```text
7: 7 - - eroare
0: 7 0 - eroare
1: 7 0 1 eroare
2: 2 0 1 eroare
0: 2 0 1 gasit
3: 2 0 3 eroare
0: 2 0 3 gasit
4: 4 0 3 eroare
```

Când vine 3, FIFO îl dădea afară pe 0, pentru că 0 era vechi. LRU vede că 0 tocmai a fost folosit și îl dă afară pe 1 în locul lui. Așa că următorul 0 e găsit. Aici LRU face 6 erori, acolo unde FIFO făcea 7

---

Cea mai bună regulă posibilă ar fi să dai afară pagina de care va fi nevoie **cel mai târziu în viitor**. Se numește **OPT**, algoritmul optim. Niciun sistem adevărat nu-l poate folosi, pentru că nimeni nu știe viitorul. Dar în exerciții e etalonul: un algoritm bun se apropie de OPT, iar LRU de obicei se apropie

Să ținem un timp exact pentru fiecare pagină la fiecare acces la memorie ar fi prea lent pentru hardware-ul adevărat. Așa că sistemele adevărate folosesc trucuri mai ieftine care se apropie de LRU, ca un singur bit „folosit” pentru fiecare pagină, pe care hardware-ul îl pune și kernelul îl șterge din când în când

---

## Misiune: Înlocuirea LRU

Simulează înlocuirea paginilor cu LRU, în același format ca în lecția despre FIFO

1. Citește numărul de cadre F, apoi numere de pagini până se termină datele
2. Pentru fiecare pagină, afișează pagina, cadrele în ordinea locurilor, cu `-` pentru unul gol, și `eroare` sau `gasit`
3. Cât timp sunt cadre goale, o pagină nouă îl ia pe primul gol. După aceea, ia locul paginii folosite cel mai demult. O găsire contează ca o folosire
4. La final, afișează numărul de erori și de găsiri

F e între 1 și 7. Paginile sunt între 0 și 99, și sunt între 1 și 200

**Exemplu**

Intrare

```text
3
7 0 1 2 0 3 0 4
```

Ieșire

```text
7: 7 - - eroare
0: 7 0 - eroare
1: 7 0 1 eroare
2: 2 0 1 eroare
0: 2 0 1 gasit
3: 2 0 3 eroare
0: 2 0 3 gasit
4: 4 0 3 eroare
Erori: 6, gasite: 2
```
