```java
class Pereche<A, B> {
    A primul;
    B alDoilea;

    Pereche(A primul, B alDoilea) {
        this.primul = primul;
        this.alDoilea = alDoilea;
    }

    A primul() {
        return primul;
    }

    B alDoilea() {
        return alDoilea;
    }

    Pereche<B, A> inverseaza() {
        return new Pereche<>(alDoilea, primul);
    }

    public String toString() {
        return "(" + primul + ", " + alDoilea + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        String nume = "Tommy";
        int scor = 120;

        Pereche<String, Integer> pereche = new Pereche<>(nume, scor);
        System.out.println(pereche);
        System.out.println(pereche.inverseaza());
        System.out.println(pereche.primul() + " are " + pereche.alDoilea() + " puncte");
    }
}
```
