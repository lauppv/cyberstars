enum Status {
    ACTIVE("Active: making money every day"),
    CLOSED("Closed: not generating income right now"),
    RENOVATION("Renovation: work in progress, opening soon"),
    DESTROYED("Destroyed: needs to be rebuilt from scratch");

    final String text;

    Status(String text) {
        this.text = text;
    }
}

public class Main {
    static void describeStatus(Status st) {
        System.out.println(st.text);
    }

    public static void main(String[] args) {
        String[] names = { "Malibu Club", "Boatyard", "Print Works", "Kaufman Cabs" };
        for (Status st : Status.values()) {
            System.out.print(names[st.ordinal()] + " - ");
            describeStatus(st);
        }
    }
}
