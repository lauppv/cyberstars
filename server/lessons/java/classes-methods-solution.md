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
        Business b1 = new Business("Malibu Club");
        b1.add(200);
        b1.add(300);
        b1.add(150);

        Business b2 = new Business("Print Works");
        b2.add(500);
        b2.add(250);

        System.out.println(b1.name + ": " + b1.getEarnings());
        System.out.println(b2.name + ": " + b2.getEarnings());
    }
}
```
