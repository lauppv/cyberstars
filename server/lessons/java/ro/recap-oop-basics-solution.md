```java
class MembruBanda {
    String nume;
    String rol;
    int ani;
    int respect;

    MembruBanda(String nume, String rol, int ani) {
        this.nume = nume;
        this.rol = rol;
        this.ani = ani;
        this.respect = 50;
    }

    void antreneaza() {
        respect = Math.min(respect + 15, 100);
    }

    void misiune() {
        respect = Math.min(respect + 10, 100);
    }

    @Override
    public String toString() {
        return nume + " (" + rol + ", " + ani + " ani) - Respect: " + respect;
    }
}

public class Main {
    public static void main(String[] args) {
        MembruBanda p1 = new MembruBanda("Tommy Vercetti", "Sef", 3);
        MembruBanda p2 = new MembruBanda("Lance Vance", "Partener", 5);
        MembruBanda p3 = new MembruBanda("Phil Cassidy", "Armurier", 2);

        p1.antreneaza();
        p1.antreneaza();
        p1.misiune();
        p2.misiune();
        p3.antreneaza();
        p3.antreneaza();
        p3.antreneaza();
        p3.antreneaza();

        System.out.println(p1);
        System.out.println(p2);
        System.out.println(p3);
    }
}
```
