Combină **metodele pe șiruri**, **listele**, **parcurgerea listelor**, și **break/continue**

---

## Misiune: Aprovizionarea

Stația primește o listă de lăzi cu provizii (deja în dreapta). Unele lăzi sunt contaminate — numele lor începe cu `BAD_`. Sortează proviziile bune într-o listă curată după aceste reguli:

1. Parcurge elementele.
2. **Sari peste** orice ladă ale cărei **primele patru caractere** sunt `BAD_` (taie cu `item[0:4]` și folosește **continue**)
3. Pentru fiecare ladă bună, adaug-o cu **MAJUSCULE** într-o listă nouă numită `clean`
4. În momentul în care adaugi `butter`, depozitul e plin — **oprește-te** imediat după ce ai adăugat-o (folosește **break**)
5. Afișează fiecare element din `clean`, câte unul pe linie
6. Afișează `Total: ` apoi câte elemente au ajuns în `clean`

**Rezultat**

```text
MILK
BREAD
CHEESE
BUTTER
Total: 4
```

Cele două lăzi `BAD_` sunt sărite, iar bucla se oprește imediat ce `butter` este adăugată — așa că `jam` nu este atins niciodată.
