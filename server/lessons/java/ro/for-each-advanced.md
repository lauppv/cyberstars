Deja cunoști bucla for-each. Acum hai să o ducem la nivelul următor cu niște **modele comune** pe care le vei folosi tot timpul când lucrezi cu colecții. Gândește-te la ele ca la mutările tale de bază — la fel cum Tommy are mereu câteva arme de încredere în inventar

---

**Modelul 1: Găsirea valorii maxime**

Parcurge lista, ținând evidența celui mai mare număr pe care l-ai văzut până acum

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(88);
        scoruri.add(42);
        scoruri.add(95);
        scoruri.add(67);

        int maxim = scoruri.get(0);
        for (int s : scoruri) {
            if (s > maxim) {
                maxim = s;
            }
        }
        System.out.println("Maxim: " + maxim);
    }
}
```

Output

```text
Maxim: 95
```

Începem cu `maxim = scoruri.get(0)` (primul element) și apoi verificăm fiecare valoare. Dacă găsim ceva mai mare, actualizăm `maxim`. Aceeași idee și pentru minim — doar schimbă `>` în `<`

---

**Modelul 2: Filtrarea într-o listă nouă**

Uneori vrei să iei doar elementele care îndeplinesc o condiție. Creează o listă nouă și adaugă doar pe cele pe care le vrei

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(88);
        scoruri.add(42);
        scoruri.add(95);
        scoruri.add(67);

        ArrayList<Integer> scoruriMari = new ArrayList<>();
        for (int s : scoruri) {
            if (s >= 80) {
                scoruriMari.add(s);
            }
        }

        System.out.println("Scoruri mari: " + scoruriMari);
    }
}
```

Output

```text
Scoruri mari: [88, 95]
```

Asta e ca filtrarea garajului tău din Vice City — păstrează mașinile rapide, scapă de cele lente

---

**Modelul 3: Numărarea potrivirilor**

Câte elemente îndeplinesc o condiție? Folosește un contor

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<>();
        echipaj.add("Tommy");
        echipaj.add("Lance");
        echipaj.add("Phil");
        echipaj.add("Cortez");
        echipaj.add("Ken");

        int numeLungi = 0;
        for (String nume : echipaj) {
            if (nume.length() > 4) {
                numeLungi++;
            }
        }
        System.out.println("Nume mai lungi de 4 caractere: " + numeLungi);
    }
}
```

Output

```text
Nume mai lungi de 4 caractere: 3
```

---

**Modelul 4: Construirea unui string rezultat**

Uneori vrei să combini elementele într-un singur string, poate cu un separator

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<>();
        echipaj.add("Tommy");
        echipaj.add("Lance");
        echipaj.add("Phil");

        String rezultat = "";
        for (int i = 0; i < echipaj.size(); i++) {
            if (i > 0) {
                rezultat += ", ";
            }
            rezultat += echipaj.get(i);
        }
        System.out.println("Echipaj: " + rezultat);
    }
}
```

Output

```text
Echipaj: Tommy, Lance, Phil
```

Folosim aici o buclă for obișnuită în loc de for-each pentru că avem nevoie de **indice** ca să știm dacă să adăugăm virgula. Primul element (indicele 0) nu primește virgulă înaintea lui

---

**Combinarea modelelor**

Poți amesteca aceste modele. Aici filtrăm ȘI numărăm într-o singură buclă

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> preturi = new ArrayList<>();
        preturi.add(150);
        preturi.add(30);
        preturi.add(250);
        preturi.add(45);
        preturi.add(500);

        int numarScumpe = 0;
        int celMaiIeftin = preturi.get(0);

        for (int p : preturi) {
            if (p > 100) {
                numarScumpe++;
            }
            if (p < celMaiIeftin) {
                celMaiIeftin = p;
            }
        }

        System.out.println("Obiecte scumpe: " + numarScumpe);
        System.out.println("Cel mai ieftin: $" + celMaiIeftin);
    }
}
```

Output

```text
Obiecte scumpe: 3
Cel mai ieftin: $30
```

---

## Misiune: Semnalul de Vârf

Rețeaua de senzori a stației a înregistrat o salvă de citiri. Comanda are nevoie de **cel mai puternic semnal** — găsește și afișează **valoarea maximă** din listă.

Citirile sunt deja încărcate într-un `ArrayList<Integer>` în dreapta. Parcurge-le, ține evidența celei mai mari valori și afișeaz-o.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- Citiri: `15, 8, 22, 3, 41, 7, 30`

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
41
```
