```java
abstract class Vehicul {
    String nume;
    Vehicul(String nume) { this.nume = nume; }
    abstract int vitezaMaxima();
}

class Sportiva extends Vehicul {
    Sportiva(String nume) { super(nume); }
    @Override
    int vitezaMaxima() { return 240; }
}

class Motocicleta extends Vehicul {
    Motocicleta(String nume) { super(nume); }
    @Override
    int vitezaMaxima() { return 200; }
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
