Până acum, am accesat câmpurile direct — `jucator.nume`, `jucator.scor`. Asta funcționează, dar e ca și cum ai lăsa ușa de la intrare larg deschisă. Oricine poate intra și schimba orice

În cod Java real, **ascundem** câmpurile și controlăm accesul prin metode. Acest concept se numește **încapsulare**

---

## Problema cu Câmpurile Publice

```java
class ContBancar {
    int sold;

    ContBancar(int sold) {
        this.sold = sold;
    }
}

public class Main {
    public static void main(String[] args) {
        ContBancar cont = new ContBancar(1000);
        cont.sold = -999999;  // Ups. Nimeni nu ne-a oprit
        System.out.println(cont.sold);
    }
}
```

Rezultat

```text
-999999
```

Phil Cassidy ar putea pur și simplu să intre lejer și să-și seteze soldul bancar la cât vrea el. Asta e rău. Avem nevoie de un bodyguard la ușă

---

## Câmpuri Private + Getteri și Setteri

Cuvântul cheie `private` înseamnă "doar codul din interiorul acestei clase poate atinge acest câmp":

```java
class ContBancar {
    private int sold;

    ContBancar(int sold) {
        this.sold = sold;
    }

    int getSold() {
        return sold;
    }

    void depune(int suma) {
        if (suma > 0) {
            sold += suma;
        }
    }

    void retrage(int suma) {
        if (suma > 0 && suma <= sold) {
            sold -= suma;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        ContBancar cont = new ContBancar(1000);
        cont.depune(500);
        cont.retrage(200);
        // cont.sold = -999999;  // EROARE! sold este private
        System.out.println("Sold: " + cont.getSold());
    }
}
```

Rezultat

```text
Sold: 1300
```

Acum singura modalitate de a schimba soldul este prin `depune()` și `retrage()`, care au **validare** încorporată. Depuneri negative? Ignorate. Retragi mai mult decât ai? Nici vorbă

---

## Tiparul Getter și Setter

Tiparul standard din Java:

- **Getter**: o metodă care returnează valoarea unui câmp privat. Numită `getNumeCamp()`
- **Setter**: o metodă care setează valoarea unui câmp privat (cu validare). Numită `setNumeCamp()`

```java
class Jucator {
    private String nume;
    private int viata;

    Jucator(String nume, int viata) {
        this.nume = nume;
        this.viata = viata;
    }

    String getNume() {
        return nume;
    }

    int getViata() {
        return viata;
    }

    void setViata(int viata) {
        if (viata >= 0 && viata <= 100) {
            this.viata = viata;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Tommy Vercetti", 100);
        p.setViata(75);
        System.out.println(p.getNume() + ": " + p.getViata() + " HP");
        p.setViata(-50);  // Ignorat! Valoare invalidă
        System.out.println(p.getNume() + ": " + p.getViata() + " HP");
    }
}
```

Rezultat

```text
Tommy Vercetti: 75 HP
Tommy Vercetti: 75 HP
```

Apelul `setViata(-50)` a fost ignorat în tăcere pentru că setterul nostru respinge valorile negative. Aceasta este puterea încapsulării — tu controlezi regulile

---

## Comparație cu Python

Python folosește decoratorii `@property` pentru aceeași idee, dar este opțional. În Java, a face câmpurile `private` și a oferi getteri/setteri este modul standard de a scrie clase. Vei vedea acest tipar peste tot

```python
# Python property (opțional)
class Jucator:
    @property
    def viata(self):
        return self._viata
```

În Java, sunt mereu metode explicite: `getViata()`, `setViata()`

---

## Când să Sari Peste Setteri

Nu fiecare câmp are nevoie de un setter. Uneori un câmp ar trebui setat o singură dată (în constructor) și niciodată schimbat. Dacă `nume` nu ar trebui să se schimbe după creare, pur și simplu nu scrie `setNume()` — problemă rezolvată

Getterul tot le permite oamenilor să **citească** numele, dar nimeni nu îl poate schimba. Acesta este un tipar comun și bun

---

## Misiune: Seiful de Credite al Stației

Seiful de credite al stației are nevoie de un sistem de tranzacții sigur. Membrii echipajului pot depune și retrage credite, dar sistemul trebuie să respingă operațiunile invalide — fără depuneri negative și fără descoperiri de cont (overdraft).

Creează o clasă `ContBancar` cu:

1. Un câmp `private int sold`
2. Un constructor care primește soldul inițial
3. O metodă `getSold()` care returnează soldul
4. O metodă `depune(int suma)` care adaugă la sold (doar dacă suma > 0)
5. O metodă `retrage(int suma)` care scade din sold (doar dacă suma > 0 și suma <= sold)

În `main`, creează un cont cu `1000` credite, depune `500`, retrage `200`, apoi încearcă să retragi `2000` (ar trebui să eșueze în tăcere) și afișează soldul final.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `1000` — soldul inițial
- `500` — suma depusă
- `200`, `2000` — sumele retrase

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
1300
```
