Pune împreună argumentele cu nume, `*args` și `**kwargs`, lambda, sorted cu key, și map și filter

---

## Misiune: Lista echipajului

Stația ține o listă a echipajului: fiecare om are un nume, un rol și o vârstă. Căpitanul vrea câteva priviri rapide asupra ei

1. Începe programul cu două variabile: **echipaj**, o listă de dicționare, fiecare cu un `"nume"` (un string), un `"rol"` (un string) și o `"varsta"` (un număr întreg), și **rol**, un string. De exemplu `echipaj = [{"nume": "Ada", "rol": "pilot", "varsta": 36}, {"nume": "Ben", "rol": "medic", "varsta": 52}, {"nume": "Cy", "rol": "pilot", "varsta": 52}]` și `rol = "pilot"`
2. Scrie o funcție **alege(oameni, \*\*potrivire)** care returnează oamenii ale căror valori sunt la fel ca fiecare valoare din `potrivire`. De exemplu `alege(echipaj, rol="pilot", varsta=52)` îl returnează doar pe Cy. Fără nicio `potrivire`, îi returnează pe toți
3. Afișează `Cei mai in varsta: ` și numele întregului echipaj de la cel mai în vârstă la cel mai tânăr, unite cu `, `. Oamenii de aceeași vârstă merg în ordinea numelor
4. Afișează `Rol: `, rolul, `: ` și numele oamenilor cu acel rol în ordinea numelor, unite cu `, `. Dacă nu îl are nimeni, afișează `nimeni` după două puncte
5. Afișează `Varste: ` și vârstele întregului echipaj, în ordinea din listă, unite cu un spațiu

Folosește `**potrivire` în `alege()`, `sorted()` cu un `key` și `map()` pentru vârste. **echipaj** are între 1 și 12 oameni, cu nume diferite, scrise cu majusculă doar la început

**Exemplu** pentru echipajul și rolul de mai sus

```text
Cei mai in varsta: Ben, Cy, Ada
Rol: pilot: Ada, Cy
Varste: 36 52 52
```
