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
        String nume1 = "Lance Vance";
        String masina1 = "Infernus";
        String nume2 = "Mercedes Cortez";
        String nume3 = "Hilary King";
        String masina3 = "Sentinel";
        MembruEchipa[] echipa = {
            new Sofer(nume1, masina1),
            new MembruEchipa(nume2),
            new Sofer(nume3, masina3)
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
