```java
public class Main {
    public static void main(String[] args) {
        int secunde = 60;

        if (secunde == 100) {
            System.out.println("Pornesc toate calculatoarele de la bord");
        } else if (secunde == 60) {
            System.out.println("Verific conexiunea cu turnul de control");
        } else if (secunde == 20) {
            System.out.println("Pornesc motoarele secundare");
        } else if (secunde == 10) {
            System.out.println("Pornesc motoarele principale");
        } else {
            System.out.println("Astept...");
        }
    }
}
```
