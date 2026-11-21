O buclă while își verifică întâi condiția. Dacă e falsă de la început, corpul nu rulează niciodată. Uneori vrei invers: rulezi corpul o dată, apoi decizi dacă mai mergi o dată. Asta face **do-while**

---

Iată un do-while care numără invers

```java
public class Main {
    public static void main(String[] args) {
        int numaratoare = 3;
        do {
            System.out.println(numaratoare);
            numaratoare--;
        } while (numaratoare > 0);
        System.out.println("Start!");
    }
}
```

Ieșire

```text
3
2
1
Start!
```

Corpul vine primul, în `do { ... }`. Condiția vine după el, în `while (...)`. Observă punctul și virgula de după condiție. do-while e singura buclă care se termină cu el

---

Deci care e diferența față de un while obișnuit? Uite ce se întâmplă când condiția e falsă din prima

```java
public class Main {
    public static void main(String[] args) {
        int benzina = 0;

        while (benzina > 0) {
            System.out.println("while: conduc");
            benzina--;
        }

        do {
            System.out.println("do-while: conduc");
            benzina--;
        } while (benzina > 0);
    }
}
```

Ieșire

```text
do-while: conduc
```

Bucla while verifică întâi, vede că `0 > 0` e fals și sare peste corp. Bucla do-while rulează corpul o dată și abia apoi verifică. Așa că un do-while rulează mereu **măcar o dată**

---

Când vrei „măcar o dată”? Un exemplu bun e citirea cifrelor unui număr. Iei ultima cifră cu `% 10`, apoi o tai cu `/ 10`, și repeți cât timp a mai rămas ceva

```java
public class Main {
    public static void main(String[] args) {
        int numar = 905;
        int suma = 0;
        do {
            suma = suma + numar % 10;
            numar = numar / 10;
        } while (numar > 0);
        System.out.println("Suma cifrelor: " + suma);
    }
}
```

Ieșire

```text
Suma cifrelor: 14
```

9 + 0 + 5 fac 14. Iar dacă numărul e 0, corpul tot rulează o dată: adună cifra 0 și se oprește. O buclă while nici nu s-ar uita la 0. La cifre, numărul 0 are și el o cifră, așa că do-while se potrivește

---

## Misiune: Kilometrajul

Tommy și-a luat un Infernus la mâna a doua și vrea să-i citească kilometrajul cifră cu cifră. Stochează distanța într-un `int` numit `kilometraj`. Apoi:

1. Afișează cifrele lui `kilometraj`, câte una pe linie, începând cu ultima cifră
2. După ele, afișează câte cifre are, ca `Cifre: N`

Folosește o buclă do-while, ca un kilometraj de 0 să arate totuși o cifră.

**Exemplu** pentru `kilometraj = 4072`

```text
2
7
0
4
Cifre: 4
```

**Exemplu** pentru `kilometraj = 0`

```text
0
Cifre: 1
```

**Exemplu** pentru `kilometraj = 50`

```text
0
5
Cifre: 2
```
