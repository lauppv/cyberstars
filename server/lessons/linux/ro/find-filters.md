`find -name` potrivește după nume. Dar `find` poate filtra și după alte proprietăți
— cel mai util după **tip** și după **dimensiune**.

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
se termină în `.log`. Mai multe condiții se listează pur și simplu una după alta —
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

## Misiune: Scanarea directorului stației

Inginerul-șef are nevoie de o privire de ansamblu asupra structurii folderului
`station` înainte de a reorganiza sistemul de fișiere.

1. Folosește `find station -type d` pentru a lista **doar directoarele** din
   `station`.
2. Folosește `find station -type f -name "*.txt"` pentru a lista **doar fișierele
   `.txt`** din `station`.

**Rezultat așteptat**

Mai întâi vezi căile directoarelor, apoi căile tuturor fișierelor `.txt` găsite sub
`station`.
