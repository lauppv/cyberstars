Uneori vrei o clasă care este un **șablon** — definește ce TREBUIE să facă clasele copil, dar nu poate fi folosită singură. Asta este o **clasă abstractă**

Gândește-te așa: „Vehicul" este un concept. Nu poți construi pur și simplu un „vehicul" generic — construiești o mașină sport, o motocicletă, un camion. Dar toate împărtășesc ideea de a fi un vehicul. În Java, ai face Vehicul **abstract**

```java
abstract class Vehicul {
    String nume;

    Vehicul(String nume) {
        this.nume = nume;
    }

    abstract int vitezaMaxima();  // fara corp! copiii TREBUIE sa implementeze asta

    void claxon() {
        System.out.println(nume + " face BIP!");
    }
}
```

Două lucruri cheie aici:

- Clasa este marcată `abstract` — NU poți face `new Vehicul("ceva")`
- Metoda `vitezaMaxima()` este marcată `abstract` — NU are corp (fără acolade), doar un punct și virgulă. Orice copil ne-abstract TREBUIE să furnizeze corpul

---

```java
public class Main {
    public static void main(String[] args) {
        Vehicul v = new Vehicul("test");  // EROARE DE COMPILARE! Nu poti instantia o clasa abstracta
    }
}
```

Este ca și cum ai încerca să cumperi un „vehicul" de la un dealer. Vânzătorul ar spune „ce FEL de vehicul?" Ai nevoie de un tip concret

---

O clasă copil care extinde o clasă abstractă TREBUIE să implementeze toate metodele abstracte — sau trebuie să fie ea însăși abstractă

```java
abstract class Vehicul {
    String nume;
    Vehicul(String nume) { this.nume = nume; }
    abstract int vitezaMaxima();
}

class Sportiva extends Vehicul {
    Sportiva(String nume) {
        super(nume);
    }

    @Override
    int vitezaMaxima() {
        return 240;
    }
}

class Motocicleta extends Vehicul {
    Motocicleta(String nume) {
        super(nume);
    }

    @Override
    int vitezaMaxima() {
        return 200;
    }
}

public class Main {
    public static void main(String[] args) {
        Sportiva infernus = new Sportiva("Infernus");
        Motocicleta angel = new Motocicleta("Angel");
        System.out.println(infernus.nume + ": " + infernus.vitezaMaxima() + " km/h");
        System.out.println(angel.nume + ": " + angel.vitezaMaxima() + " km/h");
    }
}
```

Output

```text
Infernus: 240 km/h
Angel: 200 km/h
```

---

O clasă abstractă poate avea **atât** metode abstracte (pe care copiii trebuie să le implementeze) **cât și** metode **obișnuite** (pe care copiii le moștenesc gratuit)

```java
abstract class Personaj {
    String nume;
    int viata;

    Personaj(String nume, int viata) {
        this.nume = nume;
        this.viata = viata;
    }

    // Abstract - fiecare personaj lupta diferit
    abstract void ataca();

    // Concret - toate personajele primesc daune la fel
    void primesteDaune(int cantitate) {
        viata -= cantitate;
        System.out.println(nume + " primeste " + cantitate + " daune! HP: " + viata);
    }
}
```

Tommy Vercetti și Lance Vance ar extinde amândoi `Personaj`. Fiecare ar avea propriul stil de `ataca()`, dar `primesteDaune()` funcționează la fel pentru toți

---

**Când folosești o clasă abstractă vs o clasă obișnuită?**

Folosește o **clasă obișnuită** când are sens să creezi obiecte de acel tip direct. O `Masina` este un lucru real — poți crea una

Folosește o **clasă abstractă** când clasa este doar un concept sau o categorie. „Vehicul" este abstract — nu există așa ceva ca un vehicul generic. „Personaj" ar putea fi oricare dintre cele două, în funcție de designul tău

Regula de bază: dacă nu ai vrea niciodată ca cineva să scrie `new ClasaTa()`, fă-o abstractă

---

## Misiune: Flota lui Tommy

Tommy are mai multe vehicule în garaj, fiecare cu viteza lui maximă. Are nevoie de un raport care arată fiecare vehicul și viteza lui — dar „Vehicul" în sine e doar un concept, nu ceva ce poți construi direct.

Creează o clasă abstractă `Vehicul` cu un câmp `String nume`, un constructor și o metodă abstractă `vitezaMaxima()` care returnează un int. Apoi creează două clase concrete:

1. `Sportiva` — `vitezaMaxima()` returnează `240`
2. `Motocicleta` — `vitezaMaxima()` returnează `200`

În `main`, creează o `Sportiva` numită `"Infernus"` și o `Motocicleta` numită `"Angel"`. Afișează fiecare în formatul `Nume: X km/h`.

**Exemplu**

```text
Infernus: 240 km/h
Angel: 200 km/h
```
