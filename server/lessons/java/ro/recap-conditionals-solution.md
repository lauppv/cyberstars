```java
public class Main {
    public static void main(String[] args) {
        int stele = 3;

        switch (stele) {
            case 0:
                System.out.println("Esti curat, nicio urmarire");
                break;
            case 1:
                System.out.println("O masina de politie te observa");
                break;
            case 2:
                System.out.println("Mai multe masini te urmaresc");
                break;
            case 3:
                System.out.println("Apare un elicopter");
                break;
            case 4:
                System.out.println("Sosesc fortele speciale");
                break;
            case 5:
                System.out.println("Intervine FBI-ul");
                break;
            case 6:
                System.out.println("Armata trimite tancuri");
                break;
            default:
                System.out.println("Nivel de urmarire invalid");
                break;
        }

        if (stele >= 5) {
            System.out.println("Situatie critica, fugi imediat");
        } else if (stele >= 3) {
            System.out.println("Pericol ridicat, scapa repede");
        } else if (stele >= 1) {
            System.out.println("Sub control, pierde-i prin oras");
        } else {
            System.out.println("Totul e linistit");
        }
    }
}
```
