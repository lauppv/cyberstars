Combină **căutarea liniară**, **dicționarul de frecvențe**, **bubble sort**, și **selection sort**

---

## Misiune: Clasamentul Misiunilor

De fiecare dată când un membru al echipajului finalizează o misiune, numele lui este înregistrat (deja în dreapta). Fiecare apariție contează ca **o victorie**. Mission Control vrea un clasament ordonat.

Pune cap la cap tot din acest capitol:

1. Construiește un **dicționar de frecvențe** care numără victoriile per membru al echipajului, apoi afișează `Victorii: ` urmat de dicționar.
2. Scanează dicționarul (**căutare liniară**) ca să găsești membrul echipajului cu cele mai multe victorii, și afișează `Campion: ` apoi numele și numărul de victorii, ca `Campion: Tommy (4 victorii)`.
3. Construiește o listă de tupluri **(wins, nume)**, apoi sortează-o de la cele mai multe victorii la cele mai puține folosind **selection sort** (găsește maximul la fiecare trecere, mută-l în față).
4. Afișează `=== CLASAMENT ===`, apoi fiecare membru al echipajului pe linia lui ca `rank. nume - wins victorii`.

**Ieșire**

```text
Victorii: {'Rex': 1, 'Tommy': 4, 'Boris': 3, 'Cara': 2}
Campion: Tommy (4 victorii)
=== CLASAMENT ===
1. Tommy - 4 victorii
2. Boris - 3 victorii
3. Cara - 2 victorii
4. Rex - 1 victorii
```
