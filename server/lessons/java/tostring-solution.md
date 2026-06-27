```java
class Car {
    String make;
    int year;

    Car(String make, int year) {
        this.make = make;
        this.year = year;
    }

    @Override
    public String toString() {
        return make + " (" + year + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car("Infernus", 1986);
        Car c2 = new Car("Cheetah", 1984);
        System.out.println(c1);
        System.out.println(c2);
    }
}
```
