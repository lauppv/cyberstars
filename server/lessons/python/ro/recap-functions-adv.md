Combină **scope**, **parametri impliciți**, **valori multiple returnate** și **try/except**

---

## Misiune: Trusă de Telemetrie

Construiește o mică trusă de unelte. Fiecare funcție ar trebui să lucreze doar cu **parametrii** ei și să **returneze** rezultatul (disciplină bună de scope).

1. `int_sigur(text, valoare_implicita=0)` — folosește **try/except** ca să transforme `text` într-un int. Dacă `int()` eșuează, returnează `valoare_implicita`. Parametrul `valoare_implicita` are o valoare **implicită** de `0`.
2. `summarize(numere)` — returnează **trei valori**: totalul, cel mai mare și cel mai mic dintr-o listă de numere.

În programul principal, citirile sunt deja în dreapta (unele sunt corupte). Apoi:

- parcurge `citiri` și folosește `safe_int` pe fiecare ca să construiești o listă numită `numere` (citirile corupte devin `0`)
- afișează `Numere: ` apoi acea listă
- apelează `summarize(numere)`, **despachetează** cele trei valori și afișează `Total:`, `Cel mai mare:` și `Cel mai mic:`

**Rezultat**

```text
Numere: [10, 0, 25, 7, 0]
Total: 42
Cel mai mare: 25
Cel mai mic: 0
```
