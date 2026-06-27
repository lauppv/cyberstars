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
        Carte c = new Carte("Cronicile din Vice City", "Tommy Vercetti");
        Film f = new Film("Top Gun", "Tony Scott");
        c.afiseazaInfo();
        f.afiseazaInfo();
    }
}
```
