public class Main {
    static void describeStatus(int s) {
        String[] texts = {
            "Active: making money every day",
            "Closed: not generating income right now",
            "Renovation: work in progress, opening soon",
            "Destroyed: needs to be rebuilt from scratch"
        };
        System.out.println(texts[s]);
    }

    public static void main(String[] args) {
        String[] names = { "Malibu Club", "Boatyard", "Print Works", "Kaufman Cabs" };
        for (int i = 0; i < names.length; i++) {
            System.out.print(names[i] + " - ");
            describeStatus(i);
        }
    }
}
