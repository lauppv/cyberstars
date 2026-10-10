class Car {
    String make;
    int year;

    Car(String make, int year) {
        this.make = make;
        this.year = year;
    }
}

public class Main {
    public static void main(String[] args) {
        String make1 = "Infernus";
        int year1 = 1986;
        String make2 = "Cheetah";
        int year2 = 1984;

        Car c1 = new Car(make1, year1);
        Car c2 = new Car(make2, year2);
        System.out.println(c1.make + " (" + c1.year + ")");
        System.out.println(c2.make + " (" + c2.year + ")");
    }
}
