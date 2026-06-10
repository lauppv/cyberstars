**Pipe-ul** (`|`) este una dintre cele mai puternice idei din Linux. Ia rezultatul unei
comenzi și îl trimite direct ca intrare către o altă comandă — fără să fie nevoie de
niciun fișier intermediar.

Tiparul este: `COMANDĂ1 | COMANDĂ2`.

```bash
cat system.log | grep error
```

```text
error: sensor 3 offline
error: low coolant
```

Aici `cat` afișează fișierul, iar `grep` primește acel rezultat și îl filtrează. Pipe-ul
le conectează în timp real.

### De ce nu doar `grep error system.log`?

Ambele funcționează! Dar pipe-urile strălucesc atunci când înlănțui comenzi care **nu**
pot accepta un nume de fișier ca argument sau când construiești lanțuri mai lungi
(lecția următoare). Pipe-ul face fiecare comandă combinabilă — fiecare face o singură
treabă mică, iar tu le îmbini ca pe modulele unei stații.

### Alt exemplu

```bash
ls /usr/bin | wc -l
```

Asta numără câte programe sunt în `/usr/bin` — `ls` le listează, `wc -l` numără
liniile.

---

## Misiune: Filtrul semnalelor de pericol

Ofițerul de comunicații al stației a marcat `transmissions.log` — conține mesaje de rutină amestecate cu apeluri de pericol. Centrul de comandă vrea doar urgențele.

Folosește un **pipe** ca să trimiți rezultatul lui `cat transmissions.log` în `grep` și să afișezi doar liniile care conțin `mayday`.

**Rezultat așteptat**

Ar trebui să apară trei linii, fiecare începând cu `mayday:`.
