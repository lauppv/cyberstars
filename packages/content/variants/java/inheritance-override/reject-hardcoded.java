class Business {
    int earnings() { return 0; }
}

class Club extends Business {
    Club(int customers) {}
    @Override int earnings() { return 6000; }
}

class CarWash extends Business {
    CarWash(int cars, int price) {}
    @Override int earnings() { return 240; }
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
