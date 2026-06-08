Combină **valori returnate**, **dicționare** și **parcurgerea dicționarelor**

---

## Misiune: Raport de la Centrul de Control

Scrie o funcție `analyze(scoruri)` care primește un dicționar de nume ale echipajului → scoruri și **returnează un dicționar** cu trei chei:

- `"average"` — scorul mediu (suma tuturor scorurilor împărțită la câte sunt)
- `"top"` — numele membrului echipajului cu cel mai mare scor
- `"passing"` — o **listă** de nume al căror scor este **50 sau mai mult**

Scorurile echipajului sunt deja în dreapta:

```python
scoruri = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}
```

Apelează funcția, apoi afișează raportul:

1. `Medie: ` apoi media
2. `Cel mai bun: ` apoi numele celui mai bun
3. `Promovați:` pe linia lui, apoi fiecare nume care a trecut pe liniile următoare (parcurge lista)

**Rezultat**

```text
Medie: 67.6
Cel mai bun: Tommy
Promovați:
Tommy
Cortez
Mira
```
