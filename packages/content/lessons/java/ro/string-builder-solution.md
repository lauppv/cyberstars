```java
public class Main {
    public static void main(String[] args) {
        String nume = "vice";

        StringBuilder graffiti = new StringBuilder();
        for (int i = nume.length() - 1; i >= 0; i--) {
            if (graffiti.length() > 0) {
                graffiti.append('-');
            }
            graffiti.append(Character.toUpperCase(nume.charAt(i)));
        }
        System.out.println(graffiti);
        System.out.println("Lungime: " + graffiti.length());
    }
}
```
