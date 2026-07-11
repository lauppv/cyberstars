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
        String nume1 = "Tommy Vercetti";
        String rol1 = "Sef";
        int ani1 = 3;
        String nume2 = "Lance Vance";
        String rol2 = "Partener";
        int ani2 = 5;
        String nume3 = "Phil Cassidy";
        String rol3 = "Armurier";
        int ani3 = 2;

        MembruBanda p1 = new MembruBanda(nume1, rol1, ani1);
        MembruBanda p2 = new MembruBanda(nume2, rol2, ani2);
        MembruBanda p3 = new MembruBanda(nume3, rol3, ani3);

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
