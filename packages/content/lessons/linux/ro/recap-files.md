Capitolul 2 ți-a oferit întreg setul de unelte pentru gestionarea fișierelor. E
timpul să le folosești pe toate într-o singură construcție.

| Comandă              | Rol                        |
| -------------------- | -------------------------- |
| `mkdir` (`-p`)       | creează foldere            |
| `touch`              | creează fișiere goale      |
| `cp` (`-r`)          | copiază fișiere și foldere |
| `mv`                 | mută și redenumește        |
| `rm` (`-r`), `rmdir` | șterge fișiere și foldere  |

Un folder de proiect începe aproape întotdeauna la fel: creezi directoarele, apoi pui
fișierele în ele. Planifică structura mai întâi, apoi construiește-o pas cu pas.
Folosește `ls` și `tree` între pași pentru a-ți verifica munca.

---

## Misiune: Scheletul Noii Misiuni

O misiune de explorare în spațiul îndepărtat a fost aprobată, iar echipa științifică are nevoie de folderul proiectului înainte să încarce datele. Ultimul ofițer a lăsat și gunoi în urmă. Când termini, directorul tău personal trebuie să arate așa:

```text
.
├── proiect
│   ├── documente
│   │   └── citeste-ma.txt
│   └── sursa
│       └── principal.sh
└── sablon.txt
```

`principal.sh` e gol, iar `citeste-ma.txt` e o copie a lui `sablon.txt`, cuvânt cu cuvânt. Nu rămâne nimic altceva.

**Rezultat așteptat**

Desenat ca arbore, directorul tău personal arată exact ca planul de mai sus, iar fișierul citeste-ma spune ce spune șablonul.
