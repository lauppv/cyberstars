public class Main {
    static class Business {
        int units, rate;
        Business(int units, int rate) { this.units = units; this.rate = rate; }
        int earnings() { return units * rate; }
    }

    static class Club extends Business {
        Club(int customers) { super(customers, 50); }
    }

    static class CarWash extends Business {
        CarWash(int cars, int price) { super(cars, price); }
    }

    public static void main(String[] args) {
        int customers = 120;
        int cars = 30;
        int price = 8;
        System.out.println("Club earnings: " + new Club(customers).earnings());
        System.out.println("Car wash earnings: " + new CarWash(cars, price).earnings());
    }
}
