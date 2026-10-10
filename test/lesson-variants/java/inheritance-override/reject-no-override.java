class Business {
    int earnings() { return 0; }
}

class Club extends Business {
    int customers;
    Club(int customers) { this.customers = customers; }
    @Override int earnings() { return customers * 50; }
}

class CarWash extends Business {
    int cars, price;
    CarWash(int cars, int price) { this.cars = cars; this.price = price; }
}

public class Main {
    public static void main(String[] args) {
        int customers = 120;
        int cars = 30;
        int price = 8;
        System.out.println("Club earnings: " + new Club(customers).earnings());
        System.out.println("Car wash earnings: " + new CarWash(cars, price).earnings());
    }
}
