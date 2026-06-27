```java
class Masina {
    String marca;
    int an;

    Masina(String marca, int an) {
        this.marca = marca;
        this.an = an;
    }

    @Override
    public String toString() {
        return marca + " (" + an + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Masina m1 = new Masina("Infernus", 1986);
        Masina m2 = new Masina("Cheetah", 1984);
        System.out.println(m1);
        System.out.println(m2);
    }
}
```
