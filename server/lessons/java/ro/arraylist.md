Array-urile sunt utile, dar au o limitare mare: **mărimea lor este fixă**. Odată ce creezi un array cu 5 elemente, nu poți adăuga un al 6-lea. În programele reale, adesea nu știi de la început câte elemente vei avea. Aici intervine **ArrayList**

Un **ArrayList** este un **array dinamic** — crește și se micșorează după nevoie. Trebuie importat din `java.util`

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        System.out.println(echipaj);
    }
}
```

Ieșire

```text
[Tommy Vercetti, Lance Vance, Phil Cassidy]
```

Partea **\<String\>** se numește **tip generic** — îi spune lui Java ce tip de elemente ține lista. `ArrayList<String>` înseamnă „o listă care ține String-uri." Pentru numere folosești **ArrayList\<Integer\>** sau **ArrayList\<Double\>** (nu `int`/`double` direct — Java face conversia automat)

---

Principalele metode

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> invitati = new ArrayList<String>();

        // add -- adauga la final
        invitati.add("Tommy");
        invitati.add("Lance");
        invitati.add("Mercedes");
        invitati.add("Sonny");

        // size -- cate elemente
        System.out.println("Total: " + invitati.size());

        // get -- elementul de la un indice (de la 0)
        System.out.println("Primul: " + invitati.get(0));

        // remove -- elimina de la un indice
        invitati.remove(3);
        System.out.println("Dupa eliminare: " + invitati);
    }
}
```

Ieșire

```text
Total: 4
Primul: Tommy
Dupa eliminare: [Tommy, Lance, Mercedes]
```

`.size()` cu paranteze, nu `.length` ca la array-uri — e una dintre diferențele de reținut

---

**Parcurgere cu for clasic** — când ai nevoie de indice

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        for (int i = 0; i < echipaj.size(); i++) {
            System.out.println(i + ": " + echipaj.get(i));
        }
    }
}
```

Ieșire

```text
0: Tommy Vercetti
1: Lance Vance
2: Phil Cassidy
```

**Parcurgere cu for-each** — mai curat când nu ai nevoie de indice

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        for (String nume : echipaj) {
            System.out.println("Membru: " + nume);
        }
    }
}
```

Ieșire

```text
Membru: Tommy Vercetti
Membru: Lance Vance
Membru: Phil Cassidy
```

Citește `for (String nume : echipaj)` ca: „pentru fiecare String numit `nume` din `echipaj`"

---

ArrayList devine cu adevărat puternic când ții **obiecte** în el — nu doar String-uri sau numere, ci instanțe ale claselor tale

```java
import java.util.ArrayList;

class Masina {
    String nume;
    int viteza;

    Masina(String nume, int viteza) {
        this.nume = nume;
        this.viteza = viteza;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Masina> garaj = new ArrayList<Masina>();
        garaj.add(new Masina("Infernus", 240));
        garaj.add(new Masina("Cheetah", 230));
        garaj.add(new Masina("Banshee", 200));

        for (Masina m : garaj) {
            System.out.println(m.nume + " - " + m.viteza + " km/h");
        }
    }
}
```

Ieșire

```text
Infernus - 240 km/h
Cheetah - 230 km/h
Banshee - 200 km/h
```

`ArrayList<Masina>` ține obiecte de tip `Masina`. Poți accesa câmpurile fiecărui obiect direct în buclă

---

Comparație rapidă

|          | Array   | ArrayList   |
| -------- | ------- | ----------- |
| Mărime   | Fixă    | Dinamică    |
| Lungime  | .length | .size()     |
| Acces    | arr[i]  | list.get(i) |
| For-each | merge   | merge       |
| Adăugare | nu      | .add()      |
| Ștergere | nu      | .remove()   |

---

## Misiune: Lista Echipajului

Tommy ține o listă cu membrii echipei sale din Vice City. Fiecare membru are un nume și un rol. Tommy începe cu Lance Vance (șofer), Phil Cassidy (armament), Umberto Robina (aliat) și Hilary King (șofer). La un moment dat, Lance îl trădează și trebuie eliminat din listă

Construiește o clasă `MembruEchipa` (cu `nume` și `rol`). În `main`, stochează datele fiecărui membru în variabile — `nume1`/`rol1` până la `nume4`/`rol4` (pornește cu Lance/sofer, Phil/armament, Umberto/aliat, Hilary/sofer). Adaugă-i pe toți patru într-un `ArrayList<MembruEchipa>`, elimină-l pe Lance (indexul `0`), apoi parcurge lista și afișează fiecare membru rămas ca `"nume - rol"`

**Exemplu**

```text
Phil Cassidy - armament
Umberto Robina - aliat
Hilary King - sofer
```
