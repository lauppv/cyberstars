Java poate sorta orice ArrayList de String-uri sau numere cu **Collections.sort()** — trebuie doar importat din `java.util`

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> nume = new ArrayList<>();
        nume.add("Tommy");
        nume.add("Cortez");
        nume.add("Lance");

        Collections.sort(nume);

        for (String n : nume) {
            System.out.println(n);
        }
    }
}
```

Ieșire

```text
Cortez
Lance
Tommy
```

`Collections.sort()` sortează **pe loc** — modifică direct lista originală. String-urile se sortează **alfabetic**, numerele **crescător**

---

Vrei ordine **inversă**? Folosește `Collections.reverse()` după sortare

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(88);
        scoruri.add(42);
        scoruri.add(95);

        Collections.sort(scoruri);
        Collections.reverse(scoruri);

        for (int s : scoruri) {
            System.out.println(s);
        }
    }
}
```

Ieșire

```text
95
88
42
```

`reverse()` nu sortează — doar **întoarce** ordinea actuală. Ca să obții ordine descrescătoare, sortezi întâi, apoi întorci

---

Dar cum sortezi o listă de **obiecte**? Dacă ai un `ArrayList<Masina>`, Java nu știe după ce criteriu să sorteze — după nume? după viteză? Trebuie să-i spui implementând interfața **Comparable**

```java
import java.util.ArrayList;
import java.util.Collections;

class Masina implements Comparable<Masina> {
    String nume;
    int viteza;

    Masina(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }

    public int compareTo(Masina alta) {
        return this.viteza - alta.viteza;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Masina> garaj = new ArrayList<>();
        garaj.add(new Masina("Infernus", 240));
        garaj.add(new Masina("Admiral", 150));
        garaj.add(new Masina("Cheetah", 230));

        Collections.sort(garaj);

        for (Masina m : garaj) {
            System.out.println(m.nume + " - " + m.viteza + " km/h");
        }
    }
}
```

Ieșire

```text
Admiral - 150 km/h
Cheetah - 230 km/h
Infernus - 240 km/h
```

Hai să urmărim ce se întâmplă:

1. `Masina implements Comparable<Masina>` — clasa promite că știe să se compare cu alte mașini
2. Metoda `compareTo` returnează un număr:
   - **negativ** dacă `this` vine înainte de `alta`
   - **zero** dacă sunt egale
   - **pozitiv** dacă `this` vine după `alta`
3. `this.viteza - alta.viteza` sortează crescător după viteză

Dacă vrei sortare **descrescătoare**, inversezi: `alta.viteza - this.viteza`

---

Pentru sortare după **String** (de exemplu, după nume), folosești `.compareTo()` de pe String

```text
public int compareTo(Masina alta) {
    return this.nume.compareTo(alta.nume);
}
```

---

## Misiune: Clasamentul Echipajului

Cortez vrea un clasament al echipajului, sortat după numărul de misiuni completate — de la cel mai puțin productiv la cel mai activ. Tommy a completat 47 de misiuni, Lance 12, Phil 8 și Mercedes 23

Construiește o clasă pentru membrii echipajului care implementează `Comparable` și se compară după numărul de misiuni. Creează un ArrayList cu toți membrii, sortează-l și afișează clasamentul

**Exemplu**

```text
Phil - 8 misiuni
Lance - 12 misiuni
Mercedes - 23 misiuni
Tommy - 47 misiuni
```
