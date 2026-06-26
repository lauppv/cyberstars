Acesta este un **recap**. Pune la lucru lucrurile învățate recent: **valori returnate** (`return`), **dicționare** și **parcurgerea** lor cu `.keys()`, `.values()` și `.items()`. Tu decizi cum le combini

---

## Misiune: Raport de la Centrul de Control

Ai un dicționar cu membrii echipajului și scorurile lor de la ultima misiune.

Scrie o funcție `analizeaza(scoruri)` care primește acest dicționar și **returnează un dicționar nou** cu trei chei:

- `"medie"` — scorul mediu (suma tuturor scorurilor împărțită la câți membri sunt)
- `"top"` — numele membrului cu cel mai mare scor
- `"promovati"` — o **listă** cu numele celor al căror scor este **50 sau mai mare**

Apoi **apelează** funcția și folosește dicționarul returnat ca să afișezi raportul:

1. `Medie: ` apoi media
2. `Cel mai bun: ` apoi numele celui mai bun
3. `Promovati:` pe linia lui, apoi fiecare nume promovat pe câte o linie (parcurge lista)

**Ieșire**

```text
Medie: 67.6
Cel mai bun: Tommy
Promovati:
Tommy
Cortez
Mira
```
