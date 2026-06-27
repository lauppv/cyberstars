```java
class MembruEchipa {
    String nume;
    MembruEchipa(String nume) {
        this.nume = nume;
    }
}

class Sofer extends MembruEchipa {
    String masina;
    Sofer(String nume, String masina) {
        super(nume);
        this.masina = masina;
    }
}

public class Main {
    public static void main(String[] args) {
        MembruEchipa[] echipa = {
            new Sofer("Lance Vance", "Infernus"),
            new MembruEchipa("Mercedes Cortez"),
            new Sofer("Hilary King", "Sentinel")
        };
        for (MembruEchipa m : echipa) {
            System.out.println("Nume: " + m.nume);
            if (m instanceof Sofer) {
                Sofer s = (Sofer) m;
                System.out.println("Masina: " + s.masina);
            }
        }
    }
}
```
