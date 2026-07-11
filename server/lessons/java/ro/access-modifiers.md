În Vice City, nu toată lumea are acces la tot. Camera sigură a lui Tommy este privată — pietonii oarecare nu pot intra. Ușa din față a clubului Malibu este publică. Java funcționează la fel cu **vizibilitatea (scope)** și **modificatorii de acces**

---

## Vizibilitate Locală

Variabilele declarate în interiorul unei metode există doar în interiorul acelei metode. Ele sunt **locale** — se nasc când rulează metoda, sunt distruse când se termină:

```java
public class Main {
    public static void main(String[] args) {
        int x = 10;
        if (x > 5) {
            int y = 20;
            System.out.println(x + y);  // 30 - atat x cat si y sunt vizibile aici
        }
        // System.out.println(y);  // EROARE! y nu exista in afara blocului if
        System.out.println(x);     // in regula - x este in vizibilitatea metodei
    }
}
```

Afișează

```text
30
10
```

Variabilele trăiesc în **blocul** (acoladele `{ }`) în care sunt declarate. Odată ce ieși din acel bloc, ele dispar

---

## Vizibilitate la Nivel de Clasă (Câmpuri)

Câmpurile declarate într-o clasă există atâta timp cât există obiectul. Toate metodele din clasă le pot vedea:

```java
class Jucator {
    String nume;    // vizibilitate de clasa - vizibil pentru toate metodele
    int viata;

    Jucator(String nume) {
        this.nume = nume;
        this.viata = 100;
    }

    void primesteDaune(int suma) {
        viata -= suma;    // poate accesa viata - este un camp al clasei
    }

    void afiseazaStatus() {
        System.out.println(nume + ": " + viata + " HP");  // poate accesa ambele
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Tommy Vercetti");
        p.primesteDaune(30);
        p.afiseazaStatus();
    }
}
```

Afișează

```text
Tommy Vercetti: 70 HP
```

---

## Modificatori de Acces: public vs private

Ai văzut `private` în lecția despre getteri/setteri. Iată tabloul complet:

- **`public`** — oricine poate accesa asta. Orice clasă, orice pachet, oriunde
- **`private`** — doar codul **din interiorul acestei clase** poate accesa. Nimeni altcineva
- **`protected`** — accesibil în interiorul clasei și de către subclase (vom acoperi moștenirea mai târziu)
- **fără modificator** (implicit) — accesibil în interiorul aceluiași pachet

Pentru moment, concentrează-te pe `public` și `private`. Ele sunt ce vei folosi în 99% din cazuri:

```java
class Seif {
    public String proprietar;  // oricine poate vedea cine il detine
    private int codSecret;     // doar clasa Seif poate accesa asta
    private int bani;          // doar clasa Seif se poate atinge de bani

    Seif(String proprietar, int cod, int bani) {
        this.proprietar = proprietar;
        this.codSecret = cod;
        this.bani = bani;
    }

    public boolean deblocheaza(int cod) {
        return cod == codSecret;   // camp privat folosit in interiorul clasei
    }

    public int getBani() {
        return bani;
    }
}

public class Main {
    public static void main(String[] args) {
        Seif v = new Seif("Cortez", 1234, 50000);
        System.out.println("Proprietar: " + v.proprietar);  // OK - public
        // System.out.println(v.codSecret);             // EROARE - private!
        // System.out.println(v.bani);                  // EROARE - private!
        System.out.println("Deblocat: " + v.deblocheaza(1234));
        System.out.println("Bani: " + v.getBani());
    }
}
```

Afișează

```text
Proprietar: Cortez
Deblocat: true
Bani: 50000
```

---

## Tiparul Standard

În cod Java bine scris, tiparul este:

1. Câmpurile sunt **`private`** — nimeni nu le atinge direct
2. Metodele sunt **`public`** — ele oferă acces controlat
3. Constructorul este **`public`** — ca oamenii să poată crea efectiv obiecte

```text
class Portofel {
    private int bani;

    public Portofel(int bani) {
        this.bani = bani;
    }

    public void adaugaBani(int suma) {
        if (suma > 0) {
            bani += suma;
        }
    }

    public void cheltuieBani(int suma) {
        if (suma > 0 && suma <= bani) {
            bani -= suma;
        }
    }

    public int getSold() {
        return bani;
    }
}
```

Asta îți menține datele în siguranță. Nimeni nu poate seta `bani` la -999, pentru că trebuie să treacă prin metodele tale, care au validare

---

## Variabilele Locale Sunt Mereu „Private"

Încă un lucru: variabilele locale (din interiorul metodelor) nu folosesc deloc modificatori de acces. Ele sunt automat invizibile în afara metodei lor — fără niciun cuvânt-cheie:

```text
public class Main {
    void faceTreaba() {
        int temp = 42;          // fara public/private - este locala
        // temp exista doar in interiorul lui faceTreaba()
    }
}
```

Modificatorii de acces (`public`, `private`) sunt doar pentru membrii clasei — câmpuri, metode și constructori

---

## Misiune: Portofelul lui Tommy

Tommy vrea un portofel protejat de controale de acces, ca nimeni să nu-i poată umbla la bani direct. Construiește clasa `Portofel` cu:

1. Un câmp `private int bani`
2. Un constructor `public` care primește banii de start
3. O metodă `public void adaugaBani(int suma)` — adaugă doar dacă `suma > 0`
4. O metodă `public void cheltuieBani(int suma)` — cheltuie doar dacă `suma > 0` **și** `suma <= bani`
5. O metodă `public int getSold()` care returnează soldul curent

În `main`, stochează valorile în variabile — `start` pentru banii de start, `venit` pentru cât adaugi, `cheltuiala1` și `cheltuiala2` pentru cele două sume pe care încerci să le cheltui. Apoi creează un portofel cu `start`, adaugă `venit`, cheltuie `cheltuiala1`, încearcă să cheltui `cheltuiala2` (care ar trebui să eșueze în tăcere când depășește soldul), apoi afișează soldul.

**Exemplu** — portofel pornit cu 100, +50, -30, apoi -200 respins

```text
120
```
