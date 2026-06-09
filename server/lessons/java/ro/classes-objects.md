Asta e cea mare. Totul în Java se învârte în jurul **claselor și obiectelor**, iar acum o să-ți construiești propriile tale. Dacă Java ar fi GTA Vice City, lecția asta e momentul în care încetezi să faci misiuni pentru alții și începi să-ți construiești propriul imperiu

---

Deci ce este o **clasă**? Gândește-te la ea ca la un **plan de construcție** (blueprint). Un plan pentru o mașină descrie ce **are** o mașină (culoare, viteză, combustibil) și ce poate **face** (merge, frânează, claxonează). Dar un plan nu este o mașină în sine — tu **construiești** mașini pornind de la plan

În termeni Java

- O **clasă** este planul
- Un **obiect** este un lucru concret construit din acel plan (numit și **instanță**)

```java
class Masina {
    String culoare;
    int viteza;
}
```

Asta creează o **clasă** numită **Masina** cu două **câmpuri** (numite și atribute sau proprietăți): o **culoare** (String) și o **viteză** (int). Încă nu există nicio mașină reală — este doar planul

---

Pentru a crea o mașină reală, folosim cuvântul cheie **new**

```java
class Masina {
    String culoare;
    int viteza;
}

public class Main {
    public static void main(String[] args) {
        Masina masinaMea = new Masina();
        masinaMea.culoare = "rosu";
        masinaMea.viteza = 120;

        System.out.println("Culoare: " + masinaMea.culoare);
        System.out.println("Viteza: " + masinaMea.viteza);
    }
}
```

Output

```text
Culoare: rosu
Viteza: 120
```

**new Masina()** creează un nou obiect Masina. Îl stocăm într-o variabilă numită **masinaMea**. Apoi folosim **notația cu punct** (masinaMea.culoare, masinaMea.viteza) ca să-i setăm și să-i citim câmpurile

Asta seamănă cu clasele din Python

```python
class Masina:
    def __init__(self):
        self.culoare = ""
        self.viteza = 0

masina_mea = Masina()
masina_mea.culoare = "rosu"
```

Aceeași idee, doar o sintaxă puțin diferită

---

Puterea claselor este că poți crea **mai multe obiecte** din același plan

```java
class Personaj {
    String nume;
    int viata;
    String arma;
}

public class Main {
    public static void main(String[] args) {
        Personaj tommy = new Personaj();
        tommy.nume = "Tommy Vercetti";
        tommy.viata = 100;
        tommy.arma = "M4";

        Personaj lance = new Personaj();
        lance.nume = "Lance Vance";
        lance.viata = 80;
        lance.arma = "Pistol";

        System.out.println(tommy.nume + " are " + tommy.viata + " HP și poartă un " + tommy.arma);
        System.out.println(lance.nume + " are " + lance.viata + " HP și poartă un " + lance.arma);
    }
}
```

Output

```text
Tommy Vercetti are 100 HP și poartă un M4
Lance Vance are 80 HP și poartă un Pistol
```

**tommy** și **lance** sunt două obiecte diferite, ambele construite din aceeași clasă **Personaj**. Fiecare are propriile valori pentru **nume**, **viata** și **arma** — schimbarea unuia nu afectează pe celălalt

---

Când creezi un obiect nou, toate câmpurile pornesc cu **valori implicite**

- Numerele (int, double) pornesc implicit de la **0**
- Booleenii pornesc implicit de la **false**
- Obiectele (String etc.) pornesc implicit de la **null**

```java
class Jucator {
    String nume;
    int scor;
    boolean esteOnline;
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator();
        System.out.println(p.nume);       // null
        System.out.println(p.scor);      // 0
        System.out.println(p.esteOnline);   // false
    }
}
```

---

Câteva detalii importante despre structura codului. Observă că clasa **Masina** și clasa **Main** sunt **clase separate în același fișier**. În Java, doar **o singură** clasă per fișier poate fi **public**, iar ea trebuie să se potrivească cu numele fișierului. Platforma noastră îți împachetează automat codul în clasa Main pentru programele simple, dar când îți definești propriile clase, trebuie să scrii singur întreaga structură

Clasa pe care o definești (cum ar fi **Masina** sau **Personaj**) merge **în afara** clasei Main. Clasa Main conține **main()**, locul de unde programul tău începe să ruleze

```java
class LucrulMeu {
    // câmpurile merg aici
}

public class Main {
    public static void main(String[] args) {
        // creează obiecte și folosește-le aici
    }
}
```

---

Hai să vedem de ce e util asta cu un sistem simplu de inventar de joc

```java
class Arma {
    String nume;
    int dauna;
    double greutate;
}

public class Main {
    public static void main(String[] args) {
        Arma a1 = new Arma();
        a1.nume = "Katana";
        a1.dauna = 50;
        a1.greutate = 3.5;

        Arma a2 = new Arma();
        a2.nume = "Rocket Launcher";
        a2.dauna = 200;
        a2.greutate = 15.0;

        // Compară-le
        if (a1.dauna > a2.dauna) {
            System.out.println(a1.nume + " provoacă mai multe daune");
        } else {
            System.out.println(a2.nume + " provoacă mai multe daune");
        }
    }
}
```

Output **Rocket Launcher provoacă mai multe daune**

Fără clase, ai avea nevoie de variabile separate pentru fiecare câmp în parte: **a1Nume, a1Dauna, a1Greutate, a2Nume, a2Dauna, a2Greutate**... Devine repede dezordonat. Clasele îți permit să grupezi date înrudite într-un singur pachet curat

---

## Misiune: Echipajul K-9

Divizia de securitate a stației își înregistrează câinii de patrulă K-9 în noua bază de date a echipajului. Fiecare câine are nevoie de un nume și de o vârstă în fișă înainte de a putea fi repartizat într-un sector.

Creează o clasă numită `Caine` cu două câmpuri: `String nume` și `int varsta`.

În `main`, creează două obiecte Caine:

1. Un câine numit `"Rex"` care are `5` ani
2. Un câine numit `"Buddy"` care are `3` ani

Afișează fiecare câine în formatul `Nume are X ani`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"Rex"` / `5` — numele și vârsta primului câine
- `"Buddy"` / `3` — numele și vârsta celui de-al doilea câine

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Rex are 5 ani
Buddy are 3 ani
```
