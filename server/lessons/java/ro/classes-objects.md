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

        System.out.println(tommy.nume + " are " + tommy.viata + " HP si poarta un " + tommy.arma);
        System.out.println(lance.nume + " are " + lance.viata + " HP si poarta un " + lance.arma);
    }
}
```

Output

```text
Tommy Vercetti are 100 HP si poarta un M4
Lance Vance are 80 HP si poarta un Pistol
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
    // campurile merg aici
}

public class Main {
    public static void main(String[] args) {
        // creeaza obiecte si foloseste-le aici
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

        // compara-le
        if (a1.dauna > a2.dauna) {
            System.out.println(a1.nume + " provoaca mai multe daune");
        } else {
            System.out.println(a2.nume + " provoaca mai multe daune");
        }
    }
}
```

Output **Rocket Launcher provoaca mai multe daune**

Fără clase, ai avea nevoie de variabile separate pentru fiecare câmp în parte: **a1Nume, a1Dauna, a1Greutate, a2Nume, a2Dauna, a2Greutate**... Devine repede dezordonat. Clasele îți permit să grupezi date înrudite într-un singur pachet curat

---

## Misiune: Câinii de Pază

Tommy își înregistrează câinii de pază de la conacul din Vice City. Fiecare câine are nevoie de un nume și de o vârstă în evidență înainte de a fi pus pe ture.

Creează o **clasă** care reprezintă un câine de pază, cu un câmp pentru **nume** (String) și unul pentru **vârstă** (int).

În `main`, construiește **două** obiecte câine cu valori la alegere, apoi afișează fiecare câine pe linia lui în formatul `Nume are X ani`.

**Exemplu** pentru un câine `Rex` de `5` ani și unul `Buddy` de `3` ani

```text
Rex are 5 ani
Buddy are 3 ani
```

**Exemplu** pentru un câine `Bruno` de `7` ani și unul `Ace` de `2` ani

```text
Bruno are 7 ani
Ace are 2 ani
```
