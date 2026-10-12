public class Main {
    static int add(int total, int amount) {
        return total + amount;
    }

    public static void main(String[] args) {
        String name1 = "Malibu Club";
        int sale1 = 200;
        int sale2 = 300;
        String name2 = "Print Works";
        int sale3 = 500;
        int sale4 = 250;
        int total1 = add(add(0, sale1), sale2);
        int total2 = add(add(0, sale3), sale4);
        System.out.println(name1 + ": " + total1);
        System.out.println(name2 + ": " + total2);
    }
}
