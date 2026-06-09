În lecția despre metode, am văzut că o metodă poate **returna** o valoare în loc să doar afișeze. Hai să aprofundăm **valorile returnate** — sunt una dintre cele mai puternice unelte din trusa ta Java

Gândește-te la o metodă cu valoare returnată ca la un **automat de vânzări**. Pui ceva în el (parametrii), mașina își face treaba și **îți dă ceva înapoi** (valoarea returnată). O metodă **void** este ca un difuzor — face ceva (redă un sunet), dar nu îți dă nimic în mână

```java
public class Main {
    public static int patrat(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        int rezultat = patrat(5);
        System.out.println(rezultat);   // 25
    }
}
```

Afișează **25**

Tipul returnat **int** dinaintea numelui metodei îi spune lui Java: „această metodă va da înapoi un int." În interiorul metodei, **return** trimite acea valoare înapoi celui care a apelat-o

---

Putem returna **orice tip** — nu doar int. Iată câteva exemple

```java
public class Main {
    public static String saluta(String nume) {
        return "Bun venit în Vice City, " + nume + "!";
    }

    public static double jumatate(double n) {
        return n / 2.0;
    }

    public static boolean esteVIP(String nume) {
        return nume.equals("Tommy Vercetti");
    }

    public static void main(String[] args) {
        System.out.println(saluta("Lance Vance"));
        System.out.println(jumatate(100));
        System.out.println(esteVIP("Tommy Vercetti"));
        System.out.println(esteVIP("Phil Cassidy"));
    }
}
```

Afișează

```text
Bun venit în Vice City, Lance Vance!
50.0
true
false
```

Fiecare metodă își declară tipul returnat chiar înaintea numelui: **String**, **double**, **boolean**. Tipul trebuie să corespundă cu ce returnezi de fapt — Java nu te va lăsa să returnezi un String dintr-o metodă care promite un int

---

Lucrul tare la valorile returnate este că le poți **folosi în expresii**, exact ca pe orice altă valoare

```java
public class Main {
    public static int aduna(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        // Folosește valoarea returnată direct într-un calcul
        int total = aduna(10, 20) + aduna(5, 5);
        System.out.println(total);   // 40

        // Folosește-o direct în println
        System.out.println(aduna(100, 200));   // 300

        // Folosește-o într-o condiție
        if (aduna(2, 3) > 4) {
            System.out.println("Da, 5 > 4");
        }
    }
}
```

Afișează

```text
40
300
Da, 5 > 4
```

Te poți gândi la un apel de metodă precum **aduna(10, 20)** ca fiind **înlocuit** cu valoarea sa returnată. Așa că **aduna(10, 20) + aduna(5, 5)** devine **30 + 10**, adică **40**

---

O greșeală frecventă: să încerci să faci **return** într-o metodă **void** sau să uiți să faci **return** într-o metodă care nu este void

```java
public class Main {
    // EROARE: o metodă void nu poate returna o valoare
    public static void faceTreaba() {
        return 42;   // nu se va compila
    }

    // EROARE: metoda promite int, dar nu are return
    public static int getNumar() {
        int x = 42;
        // am uitat să facem return x!
    }
}
```

Java le prinde pe amândouă la compilare. Mulțumim, Java :)

---

**void vs return** — când le folosești pe fiecare?

- Folosește **void** când metoda doar **face** ceva (afișează, modifică date etc.)
- Folosește un **tip returnat** când metoda **calculează** ceva și ai nevoie de rezultat

Tommy Vercetti nu doar duce la capăt misiuni — el **aduce înapoi banii**. Asta este o valoare returnată. Dacă doar provoacă haos fără nicio răsplată, asta este void

---

## Misiune: Forța Motorului

Puterea propulsorului stației se calculează ca `baza` ridicată la puterea `exponent`. Scrie o metodă numită `putere` care primește doi parametri `int` (`baza` și `exponent`) și **returnează** rezultatul.

Calculează-l cu o buclă: pornește de la `rezultat = 1`, apoi înmulțește cu `baza` de un total de `exponent` ori. Orice ridicat la puterea **0** este **1** — bucla ta gestionează asta natural dacă rulează de 0 ori.

Apelurile sunt deja în `main` în dreapta.

**Input** (schimbă apelurile din `main` ca să testezi):

- `baza` — numărul de bază
- `exponent` — de câte ori să înmulțești

**Exemplu**

Cu apelurile de start, programul tău ar trebui să afișeze

```text
8
25
1
```
