```java
class Business {
    String name;
    int earnings;

    Business(String name) {
        this.name = name;
        this.earnings = 0;
    }

    void add(int amount) {
        earnings += amount;
    }

    int getEarnings() {
        return earnings;
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Malibu Club";
        int sale1 = 200;
        int sale2 = 300;

        Business b1 = new Business(name1);
        b1.add(sale1);
        b1.add(sale2);

        String name2 = "Print Works";
        int sale3 = 500;
        int sale4 = 250;

        Business b2 = new Business(name2);
        b2.add(sale3);
        b2.add(sale4);

        System.out.println(b1.name + ": " + b1.getEarnings());
        System.out.println(b2.name + ": " + b2.getEarnings());
    }
}
```
