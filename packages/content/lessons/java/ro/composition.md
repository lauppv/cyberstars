Moștenirea spune că o clasă **este un** fel de altă clasă: un Driver este un CrewMember. Dar multe lucruri nu sunt un fel de ceva, ci **au** ceva. O mașină nu e un motor, are un motor. Construirea unei clase din alte obiecte se numește **compoziție**

---

Pur și simplu îi dai clasei un câmp al cărui tip e altă clasă

```java
class Motor {
    int putere;

    Motor(int putere) {
        this.putere = putere;
    }
}

class Masina {
    String model;
    Motor motor;

    Masina(String model, Motor motor) {
        this.model = model;
        this.motor = motor;
    }

    int vitezaMaxima() {
        return motor.putere / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Masina masina = new Masina("Infernus", new Motor(480));
        System.out.println(masina.model + " merge cu " + masina.vitezaMaxima());
    }
}
```

Ieșire

```text
Infernus merge cu 240
```

Mașina nu știe singură cât de repede merge. Își întreabă motorul. Să dai o treabă unui obiect pe care îl ții se numește **delegare**

---

Partea frumoasă: piesele se pot schimba în timp ce programul rulează. Pune un motor mai puternic și mașina e mai rapidă, fără nicio clasă nouă

```java
class Motor {
    int putere;

    Motor(int putere) {
        this.putere = putere;
    }
}

class Masina {
    String model;
    Motor motor;

    Masina(String model, Motor motor) {
        this.model = model;
        this.motor = motor;
    }

    int vitezaMaxima() {
        return motor.putere / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Masina masina = new Masina("Sentinel", new Motor(300));
        System.out.println(masina.vitezaMaxima());
        masina.motor = new Motor(400);
        System.out.println(masina.vitezaMaxima());
    }
}
```

Ieșire

```text
150
200
```

Cu moștenire ar fi greu: o mașină nu poate înceta să fie o `MasinaLenta` și să devină o `MasinaRapida` la jumătatea programului

---

Cum alegi? Spune-o cu voce tare:

- „un Driver **este un** CrewMember”: se potrivește moștenirea
- „o Masina **are un** Motor”, „o Banda **are** membri”: se potrivește compoziția

Când nu ești sigur, programatorii aleg de obicei compoziția. Ține clasele mici și ușor de schimbat

---

## Misiune: Magazinul de bărci

Tommy are un magazin de bărci. Scrie o clasă `Motor` cu un `int putere` și o clasă `Barca` care are un `String nume` și un `Motor`. Viteza unei bărci în noduri e puterea motorului ei împărțită la 10, fără zecimale. Dă-i clasei `Barca` o metodă `viteza()` care își întreabă motorul și o metodă `schimbaMotor(Motor motorNou)` care pune un motor nou.

Nu folosi `extends`: o barcă nu e un motor.

În `main`, stochează numele bărcii într-un `String` numit `nume` și puterea celor două motoare în variabile `int` numite `putere1` și `putere2`. Construiește barca cu primul motor și afișează `<nume>: <viteza> noduri`. Apoi pune al doilea motor și afișează din nou aceeași linie.

**Exemplu** pentru `nume = "Squalo"`, `putere1 = 300` și `putere2 = 450`

```text
Squalo: 30 noduri
Squalo: 45 noduri
```

**Exemplu** pentru `nume = "Reefer"`, `putere1 = 95` și `putere2 = 40`

```text
Reefer: 9 noduri
Reefer: 4 noduri
```
