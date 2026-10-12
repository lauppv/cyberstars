```java
class Portofel {
    private int bani;

    public Portofel(int bani) {
        this.bani = bani;
    }

    public void adaugaBani(int suma) {
        if (suma > 0) {
            bani += suma;
        }
    }

    public void cheltuieBani(int suma) {
        if (suma > 0 && suma <= bani) {
            bani -= suma;
        }
    }

    public int getSold() {
        return bani;
    }
}

public class Main {
    public static void main(String[] args) {
        int start = 100;
        int venit = 50;
        int cheltuiala1 = 30;
        int cheltuiala2 = 200;

        Portofel p = new Portofel(start);
        p.adaugaBani(venit);
        p.cheltuieBani(cheltuiala1);
        p.cheltuieBani(cheltuiala2);
        System.out.println(p.getSold());
    }
}
```
