`cat` are câteva opțiuni utile care fac citirea fișierelor mai ușoară.

### Numerotarea liniilor: `cat -n`

Opțiunea `-n` pune un **număr de linie** în fața fiecărei linii:

```bash
cat -n echipaj.txt
```

```text
     1	Ava
     2	Ben
     3	Chloe
```

Este foarte util când trebuie să te referi la „linia 12” dintr-un fișier sau să
numeri cât de jos se află ceva.

### Lipirea fișierelor

Știi deja că `cat` poate afișa mai multe fișiere la rând. Aceasta este adevărata sa
superputere — **concatenarea** lor:

```bash
cat antet.txt corp.txt subsol.txt
```

Cele trei fișiere sunt afișate unul după altul, de sus în jos, ca și cum ar fi un
singur document. Combină asta cu numerotarea:

```bash
cat -n parte1.txt parte2.txt
```

Numerotarea curge continuu prin ambele fișiere.

(Într-un capitol viitor vei învăța cum să _salvezi_ această ieșire combinată într-un
fișier nou folosind redirecționarea. Deocamdată, bucură-te doar de vederea pe ecran.)

---

## Misiune: Asamblează și arhivează lista echipajului

Lista echipajului stației s-a împărțit în două fișiere: `echipa-a.txt` și `echipa-b.txt`.
Centrul de comandă are nevoie de o vedere combinată, de un apel nominal numerotat și
de ambele fișiere păstrate împreună pentru evidență.

1. Afișează `echipa-a.txt` și `echipa-b.txt` împreună, dintr-o singură comandă.
2. Afișează din nou ambele fișiere, de data asta cu un număr de linie în fața fiecărei
   linii, numerotarea curgând continuu peste ambele.
3. Creează un folder numit `lista` și copiază ambele fișiere de echipă în el.
4. Confirmă arhiva afișând `lista/echipa-a.txt` cu liniile numerotate.

**Rezultat așteptat**

Ambele echipe apar una după alta, apoi aceleași nume cu numere de linie continue.
Folderul `lista` conține câte o copie a fiecărui fișier de echipă.
