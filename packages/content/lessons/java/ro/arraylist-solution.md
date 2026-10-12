```java
import java.util.ArrayList;

class MembruEchipa {
    String nume;
    String rol;

    MembruEchipa(String nume, String rol) {
        this.nume = nume;
        this.rol = rol;
    }
}

public class Main {
    public static void main(String[] args) {
        String nume1 = "Lance Vance";
        String rol1 = "sofer";
        String nume2 = "Phil Cassidy";
        String rol2 = "armament";
        String nume3 = "Umberto Robina";
        String rol3 = "aliat";
        String nume4 = "Hilary King";
        String rol4 = "sofer";

        ArrayList<MembruEchipa> echipa = new ArrayList<MembruEchipa>();
        echipa.add(new MembruEchipa(nume1, rol1));
        echipa.add(new MembruEchipa(nume2, rol2));
        echipa.add(new MembruEchipa(nume3, rol3));
        echipa.add(new MembruEchipa(nume4, rol4));

        echipa.remove(0);

        for (MembruEchipa m : echipa) {
            System.out.println(m.nume + " - " + m.rol);
        }
    }
}
```
