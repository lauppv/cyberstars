```java
interface Afisabil {
    void afiseazaInfo();
}

class Carte implements Afisabil {
    String titlu, autor;
    Carte(String titlu, String autor) {
        this.titlu = titlu;
        this.autor = autor;
    }
    @Override
    public void afiseazaInfo() {
        System.out.println("Carte: " + titlu + " de " + autor);
    }
}

class Film implements Afisabil {
    String titlu, regizor;
    Film(String titlu, String regizor) {
        this.titlu = titlu;
        this.regizor = regizor;
    }
    @Override
    public void afiseazaInfo() {
        System.out.println("Film: " + titlu + " regizat de " + regizor);
    }
}

public class Main {
    public static void main(String[] args) {
        String titlu1 = "Cronicile din Vice City";
        String autor1 = "Tommy Vercetti";
        String titlu2 = "Top Gun";
        String regizor2 = "Tony Scott";
        Carte c = new Carte(titlu1, autor1);
        Film f = new Film(titlu2, regizor2);
        c.afiseazaInfo();
        f.afiseazaInfo();
    }
}
```
