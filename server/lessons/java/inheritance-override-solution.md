```java
class Business {
    int earnings() {
        return 0;
    }
}

class Club extends Business {
    int customers;

    Club(int customers) {
        this.customers = customers;
    }

    @Override
    int earnings() {
        return customers * 50;
    }
}

class CarWash extends Business {
    int cars;
    int price;

    CarWash(int cars, int price) {
        this.cars = cars;
        this.price = price;
    }

    @Override
    int earnings() {
        return cars * price;
    }
}

public class Main {
    public static void main(String[] args) {
        Club c = new Club(120);
        CarWash w = new CarWash(30, 8);
        System.out.println("Club earnings: " + c.earnings());
        System.out.println("Car wash earnings: " + w.earnings());
    }
}
```
