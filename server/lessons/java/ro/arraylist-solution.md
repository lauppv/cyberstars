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
        ArrayList<MembruEchipa> echipa = new ArrayList<MembruEchipa>();
        echipa.add(new MembruEchipa("Lance Vance", "sofer"));
        echipa.add(new MembruEchipa("Phil Cassidy", "armament"));
        echipa.add(new MembruEchipa("Umberto Robina", "aliat"));
        echipa.add(new MembruEchipa("Hilary King", "sofer"));

        echipa.remove(0);

        for (MembruEchipa m : echipa) {
            System.out.println(m.nume + " - " + m.rol);
        }
    }
}
```
