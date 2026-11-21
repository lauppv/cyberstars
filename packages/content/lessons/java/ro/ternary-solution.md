```java
public class Main {
    public static void main(String[] args) {
        int stele = 3;

        String cuvant = stele == 1 ? "stea" : "stele";
        String politia = stele > 0 ? "urmareste" : "linistita";
        System.out.println("Urmarit: " + stele + " " + cuvant);
        System.out.println("Politia: " + politia);
    }
}
```
