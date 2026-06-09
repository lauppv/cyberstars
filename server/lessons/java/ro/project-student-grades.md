Ultimul proiect — hai să construim un **catalog de note**! Acesta combină **clase**, **HashMap**, și **ArrayList** într-o aplicație din lumea reală. Gândește-te la el ca la ecranul de statistici din Vice City, dar pentru școală în loc de crimă

---

**Mai întâi, o scurtă recapitulare de HashMap**

Un HashMap stochează **perechi cheie-valoare**. Perfect pentru a mapa numele unei materii la o notă

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> grades = new HashMap<>();
        grades.put("Math", 92);
        grades.put("English", 85);
        grades.put("Science", 78);

        System.out.println("Math: " + grades.get("Math"));
    }
}
```

Output

```text
Math: 92
```

`put` adaugă o pereche cheie-valoare, `get` recuperează valoarea pentru o cheie. Atât de simplu

---

**Pasul 1: Clasa Student**

Fiecare student are un **nume** și un **HashMap** care mapează numele materiilor la note

```java
import java.util.HashMap;

class Student {
    String nume;
    HashMap<String, Integer> note;

    Student(String nume) {
        this.nume = nume;
        this.note = new HashMap<>();
    }
}
```

Creăm un HashMap gol în constructor. Studentul începe fără note — le vom adăuga mai târziu cu o metodă

---

**Pasul 2: Adăugarea notelor**

```java
public class Main {
    void adaugaNota(String materie, int nota) {
        note.put(materie, nota);
    }
}
```

Foarte simplu. `note.put("Math", 95)` stochează nota 95 pentru Math. Dacă studentul are deja o notă la Math, ea este suprascrisă cu cea nouă

---

**Pasul 3: Calcularea mediei**

Ca să obținem media, trebuie să adunăm toate notele și să împărțim la câte sunt. Parcurgem **values** din HashMap

```java
public class Main {
    double getMedia() {
        int suma = 0;
        for (int nota : note.values()) {
            suma += nota;
        }
        return (double) suma / note.size();
    }
}
```

`note.values()` ne dă toate numerele notelor. Le adunăm, apoi împărțim la `note.size()` (numărul de materii). Conversia `(double)` se asigură că obținem împărțire cu zecimale, nu împărțire de întregi

---

**Pasul 4: Afișarea raportului**

Hai să afișăm un raport frumos cu numele studentului, fiecare materie cu nota ei, și media. O să parcurgem **keySet** din HashMap ca să obținem atât cheile cât și valorile

```java
public class Main {
    void afiseazaRaport() {
        System.out.println("Student: " + nume);
        for (String materie : note.keySet()) {
            System.out.println("  " + materie + ": " + note.get(materie));
        }
        System.out.println("  Media: " + String.format("%.1f", getMedia()));
    }
}
```

`note.keySet()` ne dă toate numele materiilor. Pentru fiecare, afișăm materia și nota ei. La final, afișăm media formatată la 1 zecimală

---

**Notă importantă despre ordinea în HashMap**

HashMap-urile **NU** garantează ordinea. Dacă adaugi Math, English, Science — s-ar putea să se afișeze în orice ordine. Așa funcționează HashMap-urile pe plan intern. Dacă ai nevoie de o ordine anume, ai folosi un `LinkedHashMap` în schimb (care păstrează ordinea de inserare), dar pentru moment, un HashMap obișnuit e bun

Pentru exercițiul nostru, o să folosim un **LinkedHashMap** ca rezultatul să fie previzibil

```java
import java.util.LinkedHashMap;

class Student {
    String nume;
    LinkedHashMap<String, Integer> note;

    Student(String nume) {
        this.nume = nume;
        this.note = new LinkedHashMap<>();
    }
}
```

LinkedHashMap funcționează exact ca HashMap, dar ține minte ordinea în care ai adăugat lucrurile. Gândește-te la el ca la ecranul de statistici din Vice City — îți arată mereu statisticile în aceeași ordine

---

**Exemplu complet**

```java
import java.util.LinkedHashMap;

class Student {
    String nume;
    LinkedHashMap<String, Integer> note;

    Student(String nume) {
        this.nume = nume;
        this.note = new LinkedHashMap<>();
    }

    void adaugaNota(String materie, int nota) {
        note.put(materie, nota);
    }

    double getMedia() {
        int suma = 0;
        for (int nota : note.values()) {
            suma += nota;
        }
        return (double) suma / note.size();
    }

    void afiseazaRaport() {
        System.out.println("Student: " + nume);
        for (String materie : note.keySet()) {
            System.out.println("  " + materie + ": " + note.get(materie));
        }
        System.out.println("  Media: " + String.format("%.1f", getMedia()));
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Tommy");
        s1.adaugaNota("Math", 85);
        s1.adaugaNota("English", 92);
        s1.adaugaNota("Science", 78);
        s1.afiseazaRaport();
    }
}
```

Output

```text
Student: Tommy
  Math: 85
  English: 92
  Science: 78
  Media: 85.0
```

---

Observă cum am folosit din nou **compoziția** — un Student **are un** HashMap de note. Este același tipar ca în proiectul Inventar unde Inventar **are un** ArrayList de Articole. Java din lumea reală e plină de asta: obiecte care conțin alte obiecte, fiecare cu responsabilitățile lui

Clasa Student este de sine stătătoare — știe cum să adauge note, să-și calculeze propria medie, și să-și afișeze propriul raport. Fiecare obiect își gestionează propriile date. Acesta este un design OOP bun

---

## Misiune: Generatorul de Foi Matricole al Academiei

Academia de antrenament a stației tocmai a terminat examenele. Fiecare cadet are note la mai multe materii, iar directorul academiei are nevoie de o foaie matricolă tipărită pentru fiecare student, care să-i arate scorurile și media.

1. Creează o clasă `Student` cu un `nume` (String) și un `LinkedHashMap<String, Integer>` pentru note
2. Adaugă metodele: `adaugaNota(String materie, int nota)`, `double getMedia()`, `afiseazaRaport()`
3. `afiseazaRaport()` ar trebui să afișeze:
   - `"Student: NUME"` pe prima linie
   - `"  MATERIE: NOTA"` pentru fiecare materie (două spații înainte de fiecare)
   - `"  Media: X.X"` la final (o zecimală, două spații înainte)
4. În main, creează doi studenți:
   - "Tommy" cu notele: Math 90, English 85, Science 92
   - "Lance" cu notele: Math 78, English 82, Science 88
5. Afișează ambele rapoarte

**Output**

```text
Student: Tommy
  Math: 90
  English: 85
  Science: 92
  Media: 89.0
Student: Lance
  Math: 78
  English: 82
  Science: 88
  Media: 82.7
```
