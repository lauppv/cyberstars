**Pipe-ul** (`|`) este una dintre cele mai puternice idei din Linux. Ia rezultatul unei
comenzi și îl trimite direct ca intrare către o altă comandă, fără să fie nevoie de
niciun fișier intermediar.

Tiparul este: `COMANDĂ1 | COMANDĂ2`.

```bash
cat sistem.log | grep error
```

```text
error: sensor 3 offline
error: low coolant
```

Aici `cat` afișează fișierul, iar `grep` primește acel rezultat și îl filtrează. Pipe-ul
le conectează în timp real.

### De ce nu doar `grep error sistem.log`?

Ambele funcționează! Dar pipe-urile strălucesc atunci când înlănțui comenzi care **nu**
pot accepta un nume de fișier ca argument sau când construiești lanțuri mai lungi
(lecția următoare). Pipe-ul face fiecare comandă combinabilă: fiecare face o singură
treabă mică, iar tu le îmbini ca pe modulele unei stații.

### Alt exemplu

```bash
ls /usr/bin | wc -l
```

Asta numără câte programe sunt în `/usr/bin`: `ls` le listează, `wc -l` numără
liniile.

---

## Misiune: Filtrul de Semnale de Pericol

Ofițerul de comunicații a semnalat `transmisii.log`: discuții de rutină amestecate cu apeluri de pericol, liniile care încep cu `mayday`. Într-un folder nou `centru-comanda`, comanda vrea:

- `pericol.txt` cu fiecare apel de pericol;
- `numar.txt` cu câte sunt, doar numărul, făcut într-o singură linie direct din jurnal, fără să salvezi apelurile undeva mai întâi.

**Rezultat așteptat**

`centru-comanda/pericol.txt` ține doar liniile mayday, iar `centru-comanda/numar.txt` ține doar numărul lor.
