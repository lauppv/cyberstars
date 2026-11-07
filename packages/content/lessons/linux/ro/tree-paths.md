Pe măsură ce folderele capătă sub-foldere, devine greu să-ți imaginezi întreaga
structură. Comanda **tree** o desenează pentru tine sub forma unei diagrame clare.

```bash
tree
```

```text
.
├── misiune.txt
├── rapoarte
│   ├── ianuarie.log
│   └── februarie.log
└── unelte
    └── lanseaza.sh

2 directories, 4 files
```

Indentarea și liniile arată ce se află în ce. Este o comandă care doar citește.
La fel ca `ls`, nu modifică nimic.

### Căi absolute vs relative

O **cale** este adresa unui fișier sau folder. Există două feluri.

O **cale absolută** începe la rădăcină `/` și descrie fiecare pas:

```text
/home/student/rapoarte/ianuarie.log
```

Funcționează de **oriunde**: este adresa completă.

O **cale relativă** începe de _oriunde te afli în acel moment_. Dacă ești în
`/home/student`, atunci:

```text
rapoarte/ianuarie.log
```

indică același fișier. Lipsa lui `/` la început înseamnă „pornește de aici".

Două nume speciale ajută la căile relative:

- `.`: directorul curent
- `..`: directorul părinte (un nivel mai sus)

Așadar `../unelte/lanseaza.sh` înseamnă „urcă un nivel, apoi intră în `unelte`".

Folosește `pwd` pentru a vedea locația ta absolută și `tree` pentru a vedea structura de sub tine.

---

## Misiune: Harta Stației

Înainte de reparații ai nevoie de o hartă. Desenează toată structura de sub directorul tău personal, apoi intră în arhiva de rapoarte cu o cale relativă. De acolo, fără să te muți, listează folderul care ține scriptul de lansare, cu o cale care pornește de unde stai.

**Rezultat așteptat**

Termini în arhiva de rapoarte, iar ultima ta listare arată scriptul de lansare în folderul lui.
