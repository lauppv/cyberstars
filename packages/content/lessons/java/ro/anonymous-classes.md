Uneori ai nevoie de un obiect care implementează o interfață o singură dată, într-un singur loc. Să scrii o clasă întreagă, cu nume, pare prea mult. O **clasă anonimă** te lasă să scrii clasa și să-i creezi obiectul dintr-o suflare, exact unde ai nevoie

---

Iată o interfață și o clasă obișnuită, cu nume, care o implementează

```java
interface Salut {
    String saluta(String nume);
}

class Politicos implements Salut {
    public String saluta(String nume) {
        return "Buna seara, " + nume;
    }
}

public class Main {
    public static void main(String[] args) {
        Salut s = new Politicos();
        System.out.println(s.saluta("Tommy"));
    }
}
```

Ieșire

```text
Buna seara, Tommy
```

---

Și iată aceeași idee cu o clasă anonimă. După `new Salut()` vine corpul clasei, în `{ }`. N-are nume, e folosită o dată

```java
interface Salut {
    String saluta(String nume);
}

public class Main {
    public static void main(String[] args) {
        Salut nepoliticos = new Salut() {
            public String saluta(String nume) {
                return "Ce vrei, " + nume + "?";
            }
        };
        System.out.println(nepoliticos.saluta("Lance"));
    }
}
```

Ieșire

```text
Ce vrei, Lance?
```

Atenție la final: `};`. `}` închide corpul clasei, iar `;` încheie linia `Salut nepoliticos = ...`

---

O clasă anonimă poate folosi variabilele locale din jurul ei, cu condiția să nu se mai schimbe după ce își primesc valoarea

```java
interface Salut {
    String saluta(String nume);
}

public class Main {
    public static void main(String[] args) {
        String club = "Malibu";
        Salut portar = new Salut() {
            public String saluta(String nume) {
                return "Bine ai venit la " + club + ", " + nume;
            }
        };
        System.out.println(portar.saluta("Ken"));
    }
}
```

Ieșire

```text
Bine ai venit la Malibu, Ken
```

Dacă ai scrie mai târziu în main `club = "Pole Position";`, Java ar refuza să compileze. O variabilă care nu se schimbă niciodată se numește **effectively final**

---

Clasele anonime merg și cu clasele abstracte: `new Vehicul() { ... }` completează pe loc metodele abstracte. Sunt utile pentru un comportament mic, folosit o dată. Când aceeași clasă trebuie folosită în mai multe locuri, dă-i un nume

---

## Misiune: Două oferte

Clubul Malibu are două oferte în seara asta. Scrie o interfață `Reducere` cu o singură metodă, `int aplica(int pret)`.

În `main`, stochează prețul într-un `int` numit `pret` și valoarea unui cupon într-un `int` numit `cupon`. Creează două obiecte `Reducere`, fiecare cu o clasă anonimă:

* `jumatate` dă înapoi jumătate din preț, fără zecimale
* `minus` dă înapoi prețul minus cuponul, dar niciodată mai puțin de 0

Afișează `Jumatate: N`, apoi `Cupon: N`, apoi `Cel mai bun: N`, cel mai mic dintre cele două prețuri.

**Exemplu** pentru `pret = 90` și `cupon = 20`

```text
Jumatate: 45
Cupon: 70
Cel mai bun: 45
```

**Exemplu** pentru `pret = 30` și `cupon = 50`

```text
Jumatate: 15
Cupon: 0
Cel mai bun: 0
```
