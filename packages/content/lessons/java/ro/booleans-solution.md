```java
public class Main {
    public static void main(String[] args) {
        boolean angajat = true;
        boolean ziLucratoare = true;
        boolean oaspete = false;
        boolean invitatie = false;

        if ((angajat && ziLucratoare) || (oaspete && invitatie)) {
            System.out.println("Acces permis");
        } else {
            System.out.println("Acces refuzat");
        }
    }
}
```
