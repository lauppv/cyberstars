Pune do-while, operatorul ternar, switch expression, char-urile și clasa Math să lucreze împreună într-un singur program

---

## Misiune: Telefonul public

Tommy nu are încredere în telefoanele mobile, așa că sună de la un telefon public. Scrie creierul telefonului.

Stochează numărul pe care îl formează într-un `String` numit `format` și durata apelului într-un `int` numit `minute`. Numărul poate avea liniuțe sau spații, ca `305-555-0142`.

1. Păstrează doar cifrele din `format`. Un număr adevărat are exact 10 cifre. Dacă nu are, afișează `Numar invalid` și nimic altceva
2. Primele 3 cifre sunt prefixul. Scrie o metodă care primește prefixul și dă înapoi unde merge apelul, cu un switch expression:
   * `305` sau `786`: `Vice City`
   * `212`: `Liberty City`
   * `415`: `San Fierro`
   * orice altceva: `Distanta lunga`
3. Un minut costă 1 fisă în Vice City, 3 fise în Liberty City sau San Fierro și 5 fise pentru distanță lungă. Chiar și un apel de 0 minute se plătește ca 1 minut
4. Afișează `Apelez <loc>`, apoi `Cost: N fise`, sau `Cost: 1 fisa` când e exact una. Alege cuvântul cu operatorul ternar

**Exemplu** pentru `format = "305-555-0142"` și `minute = 3`

```text
Apelez Vice City
Cost: 3 fise
```

**Exemplu** pentru `format = "212 555 0199"` și `minute = 0`

```text
Apelez Liberty City
Cost: 3 fise
```

**Exemplu** pentru `format = "786-555-0100"` și `minute = 1`

```text
Apelez Vice City
Cost: 1 fisa
```

**Exemplu** pentru `format = "555-0142"` și `minute = 2`

```text
Numar invalid
```
