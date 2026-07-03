`cat` are câteva opțiuni utile care fac citirea fișierelor mai ușoară.

### Numerotarea liniilor: `cat -n`

Opțiunea `-n` pune un **număr de linie** în fața fiecărei linii:

```bash
cat -n crew.txt
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
cat header.txt body.txt footer.txt
```

Cele trei fișiere sunt afișate unul după altul, de sus în jos, ca și cum ar fi un
singur document. Combină asta cu numerotarea:

```bash
cat -n part1.txt part2.txt
```

Numerotarea curge continuu prin ambele fișiere.

(Într-un capitol viitor vei învăța cum să _salvezi_ această ieșire combinată într-un
fișier nou folosind redirecționarea. Deocamdată, bucură-te doar de vederea pe ecran.)

---

## Misiune: Asamblează lista echipajului

Lista echipajului stației s-a împărțit în două fișiere: `echipa-a.txt` și `echipa-b.txt`.
Centrul de comandă are nevoie de o vedere combinată și de un apel nominal numerotat
al echipei A.

1. Folosește `cat` pentru a afișa `echipa-a.txt` și `echipa-b.txt` împreună, dintr-o
   singură comandă.
2. Rulează `cat -n` pe `echipa-a.txt` pentru a vedea liniile sale numerotate.

**Rezultat așteptat**

Vezi ambele echipe listate una după alta, apoi lista echipei A cu numere de linie în
fața fiecărui nume.
