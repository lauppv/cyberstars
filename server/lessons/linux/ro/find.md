`grep` caută text _în interiorul_ fișierelor. Dar uneori cauți **fișierul în sine**
— „unde am pus fișierul ăla numit `report.txt`?”. Pentru asta există **find**.

`find` parcurge un arbore de directoare și listează fișierele care se potrivesc cu
descrierea ta.

Forma de bază este: `find UNDE-SĂ-CAUT CONDIȚII`.

### Căutare după nume: `-name`

Cea mai folosită condiție este `-name` — potrivește fișierele după nume:

```bash
find . -name report.txt
```

```text
./docs/report.txt
./archive/old/report.txt
```

`.` înseamnă „pornește de aici”. `find` caută în acel folder **și în fiecare
sub-folder din el**, apoi afișează calea fiecărei potriviri.

### Caractere joker

Simbolul `*` se potrivește cu „orice caractere”. Pune tiparul între ghilimele ca
shell-ul să nu îl extindă mai întâi:

```bash
find . -name "*.log"
```

Astfel găsești fiecare fișier care se termină în `.log`, oriunde în arbore.

### Unde să cauți

Poți să-i indici lui `find` orice folder, nu doar `.`:

```bash
find logs -name "error.txt"
```

`find` este unealta ta pentru „știu numele, nu și locația”.

---

## Misiune: Localizează fișierul clasificat

Serviciul de informații raportează că un document clasificat numit `secret.txt`
este stocat undeva în arborele directorului tău personal, dar nimeni nu mai
ține minte calea exactă.

Folosește `find` cu `-name` pentru a localiza `secret.txt` și a-i afișa calea
completă.

**Rezultat așteptat**

Terminalul afișează calea către `secret.txt` din arborele de directoare.
