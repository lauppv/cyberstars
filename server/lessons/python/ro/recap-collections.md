Combină **metodele pe șiruri**, **listele**, **parcurgerea listelor**, și **break/continue**

---

## Misiune: Aprovizionarea

Stația primește o listă de lăzi cu provizii (deja în dreapta). Unele lăzi sunt contaminate — numele lor începe cu `con-`. Sortează proviziile bune într-o listă curată după aceste reguli:

1. Parcurge elementele.
2. **Sari peste** orice ladă ale cărei **primele 4 caractere** sunt `con-`
3. Pentru fiecare ladă bună, adaug-o într-o listă nouă numită `curate`
4. În momentul în care adaugi `unt`, depozitul e plin — **oprește-te** imediat după ce ai adăugat-o
5. Afișează fiecare element din `curate`, câte unul pe linie
6. Afișează `Total: ` apoi câte elemente au ajuns în `curate`

**Ieșire**

```text
lapte
paine
branza
unt
Total: 4
```

Cele două lăzi `con-` sunt sărite, iar bucla se oprește imediat ce `unt` este adăugată — așa că `gem` nu este atins niciodată.
