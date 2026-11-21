O interfață enumeră metodele pe care trebuie să le scrie fiecare clasă care o implementează. Dar uneori cele mai multe clase ar scrie același cod. O **metodă default** e o metodă cu corp, chiar în interfață. Fiecare clasă o primește gratis, iar o clasă care are nevoie de altceva o poate suprascrie

---

Pui `default` în fața metodei și îi dai un corp

```java
interface Arma {
    String nume();
    int daune();

    default String descriere() {
        return nume() + " loveste cu " + daune();
    }
}

class Pistol implements Arma {
    public String nume() {
        return "Pistol";
    }

    public int daune() {
        return 25;
    }
}

public class Main {
    public static void main(String[] args) {
        Arma a = new Pistol();
        System.out.println(a.descriere());
    }
}
```

Ieșire

```text
Pistol loveste cu 25
```

`Pistol` a scris doar `nume()` și `daune()`. Are totuși `descriere()`, din interfață. Și observă că metoda default apelează celelalte metode ale interfeței: nu știe în ce clasă se află, dar știe că fiecare clasă are `nume()` și `daune()`

---

O clasă poate suprascrie o metodă default, exact ca pe o metodă moștenită

```java
interface Arma {
    String nume();
    int daune();

    default String descriere() {
        return nume() + " loveste cu " + daune();
    }
}

class Katana implements Arma {
    public String nume() {
        return "Katana";
    }

    public int daune() {
        return 40;
    }

    @Override
    public String descriere() {
        return "O katana tacuta, " + daune() + " daune";
    }
}

public class Main {
    public static void main(String[] args) {
        Arma a = new Katana();
        System.out.println(a.descriere());
    }
}
```

Ieșire

```text
O katana tacuta, 40 daune
```

---

De ce are Java asta? Imaginează-ți o interfață pe care o implementează deja o sută de clase. Adaugă-i o metodă obișnuită și toate cele o sută de clase nu mai compilează până nu o scrie fiecare. Adaugă o metodă default și toate merg mai departe

Metodele default nu pot avea câmpuri. O interfață tot nu ține date, doar comportament

---

## Misiune: Vehicule și bărci

Scrie o interfață `Vehicul` cu două metode, `String nume()` și `int viteza()`, și o metodă default `descriere()` care dă înapoi `<nume> merge cu <viteza> km/h`, urmat de `, rapid` când viteza e de cel puțin 200.

Scrie o clasă `Masina` care implementează `Vehicul` și păstrează `descriere()`-ul default. Scrie o clasă `Barca` care implementează `Vehicul` și suprascrie `descriere()` ca să dea înapoi `<nume> navigheaza cu <viteza> noduri`.

În `main`, stochează numele și viteza mașinii în `numeMasina` și `vitezaMasina`, iar ale bărcii în `numeBarca` și `vitezaBarca`. Afișează descrierea mașinii, apoi pe a bărcii.

**Exemplu** pentru `numeMasina = "Infernus"`, `vitezaMasina = 240`, `numeBarca = "Squalo"` și `vitezaBarca = 95`

```text
Infernus merge cu 240 km/h, rapid
Squalo navigheaza cu 95 noduri
```

**Exemplu** pentru `numeMasina = "Idaho"`, `vitezaMasina = 150`, `numeBarca = "Jetmax"` și `vitezaBarca = 210`

```text
Idaho merge cu 150 km/h
Jetmax navigheaza cu 210 noduri
```
