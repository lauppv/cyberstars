E timpul pentru un proiect adevărat! O să construim un **sistem de inventar** — Tommy gestionează depozitul stației, ține evidența proviziilor și trebuie să știe ce are și cât valorează totul

Acest proiect aduce împreună tot ce ai învățat: **clase**, **constructori**, **ArrayList-uri**, **metode**, și **bucle**. Hai să-l construim bucată cu bucată

---

**Pasul 1: Clasa Articol**

Fiecare obiect din inventarul nostru are un **nume**, o **cantitate**, și un **pret** per unitate. Hai să modelăm asta

```text
class Articol {
    String nume;
    int cantitate;
    double pret;

    Articol(String nume, int cantitate, double pret) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.pret = pret;
    }
}
```

Simplu și curat. Un `Articol` își știe numele, câte avem, și cât costă fiecare. Constructorul primește toate cele trei valori și le configurează

---

**Pasul 2: Clasa Inventar**

Clasa `Inventar` ține o listă de obiecte și oferă metode ca să le gestioneze. Aici intră în scenă ArrayList — nu știm câte provizii vor fi stocate, așa că un array de dimensiune fixă nu e de ajuns

```text
import java.util.ArrayList;

class Inventar {
    ArrayList<Articol> articole;

    Inventar() {
        articole = new ArrayList<>();
    }

    void adaugaArticol(Articol articol) {
        articole.add(articol);
    }
}
```

Inventarul începe gol. `adaugaArticol` adaugă un obiect la listă

---

**Pasul 3: Eliminarea obiectelor**

Pentru `stergeArticol`, o să căutăm după nume și o să eliminăm prima potrivire. Avem nevoie de o buclă for obișnuită (nu for-each) pentru că ne trebuie indicele ca să eliminăm

```text
public class Main {
    void stergeArticol(String nume) {
        for (int i = 0; i < articole.size(); i++) {
            if (articole.get(i).nume.equals(nume)) {
                articole.remove(i);
                return;
            }
        }
    }
}
```

Parcurgem obiectele, verificăm dacă numele se potrivește, îl eliminăm, și **returnăm** imediat (nu are rost să continuăm după ce l-am găsit și eliminat)

---

**Pasul 4: Afișarea tuturor obiectelor**

Hai să afișăm fiecare obiect într-un format frumos. Aici devine util String.format

```text
public class Main {
    void afiseazaTot() {
        for (Articol articol : articole) {
            System.out.println(articol.nume + " x" + articol.cantitate + " @ $" + String.format("%.2f", articol.pret));
        }
    }
}
```

Pentru un articol numit "Trusa medicala" cu cantitate 5 și pret 25.00, asta afișează:

```text
Trusa medicala x5 @ $25.00
```

---

**Pasul 5: Calcularea valorii totale**

Valoarea totală este suma lui `cantitate * pret` pentru fiecare obiect. Tiparul clasic de buclă-și-acumulare

```text
public class Main {
    double valoareTotala() {
        double total = 0;
        for (Articol articol : articole) {
            total += articol.cantitate * articol.pret;
        }
        return total;
    }
}
```

---

Iată programul complet pus cap la cap

```java
import java.util.ArrayList;

class Articol {
    String nume;
    int cantitate;
    double pret;

    Articol(String nume, int cantitate, double pret) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.pret = pret;
    }
}

class Inventar {
    ArrayList<Articol> articole;

    Inventar() {
        articole = new ArrayList<>();
    }

    void adaugaArticol(Articol articol) {
        articole.add(articol);
    }

    void stergeArticol(String nume) {
        for (int i = 0; i < articole.size(); i++) {
            if (articole.get(i).nume.equals(nume)) {
                articole.remove(i);
                return;
            }
        }
    }

    void afiseazaTot() {
        for (Articol articol : articole) {
            System.out.println(articol.nume + " x" + articol.cantitate + " @ $" + String.format("%.2f", articol.pret));
        }
    }

    double valoareTotala() {
        double total = 0;
        for (Articol articol : articole) {
            total += articol.cantitate * articol.pret;
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventar inv = new Inventar();
        inv.adaugaArticol(new Articol("Trusa medicala", 5, 25.00));
        inv.adaugaArticol(new Articol("Rezerva oxigen", 2, 75.50));
        inv.adaugaArticol(new Articol("Baterie solara", 1, 100.00));

        inv.afiseazaTot();
        System.out.println("Total: $" + String.format("%.2f", inv.valoareTotala()));
    }
}
```

Ieșire

```text
Trusa medicala x5 @ $25.00
Rezerva oxigen x2 @ $75.50
Baterie solara x1 @ $100.00
Total: $376.00
```

---

Observă cum clasele lucrează împreună: `Articol` este un simplu container de date, iar `Inventar` gestionează o colecție de obiecte. Asta este **compoziția** — Inventar **are** o listă de Articole. Este unul dintre cele mai comune tipare din Java din lumea reală

Observă și: `Articol` și `Inventar` NU sunt public — doar `Main` este public. Asta pentru că Java permite o singură clasă public per fișier, și cum fișierul este compilat ca `Main.java`, clasa public trebuie să fie `Main`

---

## Misiune: Manifestul Compartimentului de Marfă

Compartimentul de marfă al stației are nevoie de un sistem de manifest digital. Fiecare provizii are un nume, o cantitate și un preț unitar. Construiește urmăritorul de inventar ca intendentul să poată lista totul și să calculeze valoarea totală dintr-o privire.

1. Creează o clasă `Articol` cu câmpurile: `nume` (String), `cantitate` (int), `pret` (double) și un constructor
2. Creează o clasă `Inventar` cu un `ArrayList<Articol>`, și metodele: `adaugaArticol(Articol articol)`, `stergeArticol(String nume)`, `afiseazaTot()`, și `double valoareTotala()`
3. `afiseazaTot()` afișează fiecare obiect ca `"nume xCantitate @ $pret"` (folosește `String.format("%.2f", pret)`)
4. `valoareTotala()` returnează suma lui `cantitate * pret` pentru toate obiectele
5. În main, creează un Inventar și adaugă aceste provizii:
   - "Filtru aer", cantitate 4, pret 35.00
   - "Pachet hrana", cantitate 10, pret 12.00
   - "Kit reparatii", cantitate 3, pret 85.00
6. Apelează `afiseazaTot()`, apoi afișează `"Total: $"` urmat de totalul formatat

**Ieșire**

```text
Filtru aer x4 @ $35.00
Pachet hrana x10 @ $12.00
Kit reparatii x3 @ $85.00
Total: $515.00
```
