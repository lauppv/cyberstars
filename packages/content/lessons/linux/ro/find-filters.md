`find -name` potrivește după nume. Dar `find` poate filtra și după alte proprietăți,
cel mai util după **tip** și după **dimensiune**.

### Filtrare după tip: `-type`

Opțiunea `-type` spune dacă vrei fișiere sau directoare:

| Condiție  | Potrivește            |
| --------- | --------------------- |
| `-type f` | **fișiere** obișnuite |
| `-type d` | **directoare**        |

```bash
find . -type d
```

Asta listează fiecare folder de sub `.`. Ca să găsești doar fișiere:

```bash
find . -type f -name "*.log"
```

Se citește așa: sub `.`, găsește lucrurile care sunt **fișiere** _și_ al căror nume
se termină în `.log`. Mai multe condiții se listează pur și simplu una după alta:
`find` cere ca **toate** să se potrivească.

### Filtrare după dimensiune: `-size`

Opțiunea `-size` potrivește fișiere după cât de mari sunt:

| Exemplu     | Potrivește             |
| ----------- | ---------------------- |
| `-size +1k` | mai mari de 1 kilobyte |
| `-size -1k` | mai mici de 1 kilobyte |
| `-size +1M` | mai mari de 1 megabyte |

Un `+` înseamnă „mai mare decât”, un `-` înseamnă „mai mic decât”. Litera este
unitatea (`k`, `M`, `G`).

```bash
find . -type f -size +1k
```

Asta găsește fiecare fișier mai mare de 1 KB.

---

## Misiune: Scanarea Directoarelor Stației

Inginerul-șef reorganizează folderul `statie` și are nevoie mai întâi de o privire de ansamblu:

1. Fiecare folder din `statie` și nimic din ce e fișier.
2. Fiecare notiță text din `statie`, fișierele care se termină în `.txt`, oriunde ar sta.
3. Toate aceste notițe adunate într-un folder nou `index-txt`, fiecare cu numele ei.

**Rezultat așteptat**

Vezi căile folderelor, apoi căile notițelor text, iar `index-txt` ține o copie a fiecărei notițe.
