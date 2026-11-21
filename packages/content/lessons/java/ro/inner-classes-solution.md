```java
import java.util.ArrayList;

class Banda {
    String nume;
    ArrayList<Membru> membri = new ArrayList<>();

    Banda(String nume) {
        this.nume = nume;
    }

    class Membru {
        String porecla;

        Membru(String porecla) {
            this.porecla = porecla;
        }

        String ecuson() {
            return porecla + " (" + nume + ")";
        }
    }

    void recruteaza(String porecla) {
        membri.add(new Membru(porecla));
    }
}

public class Main {
    public static void main(String[] args) {
        String numeBanda = "Banda Vercetti";
        String[] porecle = { "Lance", "Ken" };

        Banda banda = new Banda(numeBanda);
        for (String porecla : porecle) {
            banda.recruteaza(porecla);
        }
        for (Banda.Membru membru : banda.membri) {
            System.out.println(membru.ecuson());
        }
        System.out.println("Membri: " + banda.membri.size());
    }
}
```
