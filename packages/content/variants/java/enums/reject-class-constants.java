public class Main {
    static final class Status {
        final String text;

        private Status(String text) {
            this.text = text;
        }

        static Status[] values() {
            return new Status[] {
                new Status("Active: making money every day"),
                new Status("Closed: not generating income right now"),
                new Status("Renovation: work in progress, opening soon"),
                new Status("Destroyed: needs to be rebuilt from scratch")
            };
        }
    }

    static void describeStatus(Status s) {
        System.out.println(s.text);
    }

    public static void main(String[] args) {
        String[] names = { "Malibu Club", "Boatyard", "Print Works", "Kaufman Cabs" };
        int i = 0;
        for (Status s : Status.values()) {
            System.out.print(names[i] + " - ");
            describeStatus(s);
            i++;
        }
    }
}
