`cat` are câteva opțiuni utile care fac citirea fișierelor mai ușoară.

### Numerotarea liniilor: `cat -n`

Opțiunea `-n` pune un număr de linie în fața fiecărei linii:

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
superputere, **concatenarea** lor:

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

## Misiune: Lista Echipajului

Lista echipajului s-a rupt în `echipa-a.txt` și `echipa-b.txt`. Comanda vrea un apel: toate numele din ambele echipe într-o singură listă, fiecare cu numărul lui, numărătoarea continuând de la echipa A în echipa B, fără să o ia de la capăt. Mai vor ambele fișiere păstrate împreună într-un folder nou `lista`.

**Rezultat așteptat**

Vezi o singură listă numerotată în care numerele continuă de la prima echipă la a doua, iar `lista` ține câte o copie a fiecărui fișier de echipă.
