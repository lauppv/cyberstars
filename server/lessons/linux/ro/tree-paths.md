Pe măsură ce folderele capătă sub-foldere, devine greu să-ți imaginezi întreaga
structură. Comanda **tree** o desenează pentru tine sub forma unei diagrame clare.

```bash
tree
```

```text
.
├── mission.txt
├── reports
│   ├── january.log
│   └── february.log
└── tools
    └── deploy.sh

2 directories, 4 files
```

Indentarea și liniile arată ce se află în ce. Este o comandă care doar citește —
la fel ca `ls`, nu modifică nimic.

### Căi absolute vs relative

O **cale** este adresa unui fișier sau folder. Există două feluri.

O **cale absolută** începe la rădăcină `/` și descrie fiecare pas:

```text
/home/student/reports/january.log
```

Funcționează de **oriunde** — este adresa completă.

O **cale relativă** începe de _oriunde te afli în acel moment_. Dacă ești în
`/home/student`, atunci:

```text
reports/january.log
```

indică același fișier. Lipsa lui `/` la început înseamnă „pornește de aici".

Două nume speciale ajută la căile relative:

- `.` — directorul curent
- `..` — directorul părinte (un nivel mai sus)

Așadar `../tools/deploy.sh` înseamnă „urcă un nivel, apoi intră în `tools`".

Folosește `pwd` pentru a vedea locația ta absolută și `tree` pentru a vedea structura de sub tine.

---

## Misiune: Cartografiază Stația

Înainte de a începe reparațiile, ai nevoie de o hartă completă a structurii sistemului de fișiere al stației și de confirmarea poziției tale curente.

1. Rulează `tree` pentru a vedea întreaga structură de directoare dintr-o privire.
2. Rulează `pwd` pentru a-ți confirma calea absolută.

**Rezultat așteptat**

Vezi o diagramă arborescentă cu toate fișierele și folderele din directorul tău personal, iar `pwd` confirmă că te afli în `/home/student`.
