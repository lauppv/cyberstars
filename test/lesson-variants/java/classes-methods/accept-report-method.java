public class Main {
    static class Business {
        String name;
        long earnings = 0;

        Business(String name) { this.name = name; }

        Business add(int amount) {
            earnings += amount;
            return this;
        }

        String report() {
            return name + ": " + earnings;
        }
    }

    public static void main(String[] args) {
        String name1 = "Malibu Club";
        int sale1 = 200;
        int sale2 = 300;
        String name2 = "Print Works";
        int sale3 = 500;
        int sale4 = 250;
        System.out.println(new Business(name1).add(sale1).add(sale2).report());
        System.out.println(new Business(name2).add(sale3).add(sale4).report());
    }
}
