Cu `Comparable`, o clasă are un singur fel de a se sorta, scris în interiorul clasei. Dar o listă de mașini poate fi sortată azi după viteză și mâine după nume. Pentru asta folosești un **Comparator**: un mic obiect care știe să compare două elemente

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

class Masina {
    String nume;
    int viteza;

    Masina(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }
}

class DupaViteza implements Comparator<Masina> {
    public int compare(Masina a, Masina b) {
        return a.viteza - b.viteza;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Masina> garaj = new ArrayList<>();
        garaj.add(new Masina("Infernus", 240));
        garaj.add(new Masina("Admiral", 150));
        garaj.add(new Masina("Cheetah", 230));

        Collections.sort(garaj, new DupaViteza());
        for (Masina m : garaj) {
            System.out.println(m.nume + " " + m.viteza);
        }
    }
}
```

Ieșire

```text
Admiral 150
Cheetah 230
Infernus 240
```

`compare(a, b)` urmează aceeași regulă ca `compareTo`: negativ dacă a vine primul, zero dacă sunt egale, pozitiv dacă b vine primul. Clasa `Masina` nu se schimbă deloc

---

Poți scrie câți comparatori vrei, câte unul pentru fiecare ordine. Și orice comparator are o metodă `reversed()` care îți dă ordinea inversă

```java
import java.util.ArrayList;
import java.util.Comparator;

class Masina {
    String nume;
    int viteza;

    Masina(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }
}

class DupaNume implements Comparator<Masina> {
    public int compare(Masina a, Masina b) {
        return a.nume.compareTo(b.nume);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Masina> garaj = new ArrayList<>();
        garaj.add(new Masina("Infernus", 240));
        garaj.add(new Masina("Admiral", 150));
        garaj.add(new Masina("Cheetah", 230));

        garaj.sort(new DupaNume());
        System.out.println(garaj.get(0).nume);

        garaj.sort(new DupaNume().reversed());
        System.out.println(garaj.get(0).nume);
    }
}
```

Ieșire

```text
Admiral
Infernus
```

`lista.sort(comparator)` face același lucru ca `Collections.sort(lista, comparator)`. Folosește-l pe care îl preferi

---

Pentru un comparator folosit o singură dată, nu ai nevoie de o clasă cu nume. Ajunge o clasă anonimă

```java
import java.util.ArrayList;
import java.util.Comparator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> nume = new ArrayList<>();
        nume.add("Mercedes");
        nume.add("Phil");
        nume.add("Lance");

        nume.sort(new Comparator<String>() {
            public int compare(String a, String b) {
                return a.length() - b.length();
            }
        });
        System.out.println(nume);
    }
}
```

Ieșire

```text
[Phil, Lance, Mercedes]
```

Aici am sortat String-urile după lungime, nu alfabetic

---

Încă ceva: când două elemente sunt egale pentru comparator, sortarea le păstrează în ordinea pe care o aveau înainte. Te poți baza pe asta

---

## Misiune: Rezultatele Cursei

Tommy a organizat o cursă pe străzi. Acum vrea două liste: una după timp, să vadă cine a câștigat, și una după nume, ca să plătească pe toată lumea

Piloții sunt într-un array `String[] piloti`, iar timpii lor în secunde într-un array `int[] timpi`. `piloti[i]` a terminat în `timpi[i]` secunde. Afișează `După timp:`, apoi fiecare pilot ca `nume - timp s`, cel mai rapid primul. Dacă doi piloți au același timp, păstrează-i în ordinea din array-uri. Apoi afișează `După nume:` și aceleași rânduri în ordine alfabetică

**Exemplu**

```text
După timp:
Lance - 58 s
Tommy - 61 s
Candy - 61 s
Phil - 75 s
După nume:
Candy - 61 s
Lance - 58 s
Phil - 75 s
Tommy - 61 s
```

**Exemplu**

```text
După timp:
Kent - 90 s
După nume:
Kent - 90 s
```
