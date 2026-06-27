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
        Portofel p = new Portofel(100);
        p.adaugaBani(50);
        p.cheltuieBani(30);
        p.cheltuieBani(200);
        System.out.println(p.getSold());
    }
}
```
