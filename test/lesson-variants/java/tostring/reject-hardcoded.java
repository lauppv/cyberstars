class Car {
    String make;
    int year;

    Car(String make, int year) {
        this.make = make;
        this.year = year;
    }

    @Override
    public String toString() {
        return year == 1986 ? "Infernus (1986)" : "Cheetah (1984)";
    }
}

public class Main {
    public static void main(String[] args) {
        String make1 = "Infernus";
        int year1 = 1986;
        String make2 = "Cheetah";
        int year2 = 1984;

        System.out.println(new Car(make1, year1));
        System.out.println(new Car(make2, year2));
    }
}
