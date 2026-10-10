public class Main {
    enum Status { ACTIVE, CLOSED, RENOVATION, DESTROYED }

    static void describeStatus(Status s) {
        String msg = switch (s) {
            case ACTIVE -> "Active: making money every day";
            case CLOSED -> "Closed: not generating income right now";
            case RENOVATION -> "Renovation: work in progress, opening soon";
            case DESTROYED -> "Destroyed: needs to be rebuilt from scratch";
        };
        System.out.println(msg);
    }

    public static void main(String[] args) {
        String[] names = { "Malibu Club", "Boatyard", "Print Works", "Kaufman Cabs" };
        Status[] all = Status.values();
        int k = 0;
        while (k < all.length) {
            System.out.print(names[k]);
            System.out.print(" - ");
            describeStatus(all[k]);
            k++;
        }
    }
}
