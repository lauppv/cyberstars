class Door implements AutoCloseable {
    Door(String name) { System.out.println("Door opens for " + name); }
    public void close() { System.out.println("Door locks"); }
}

public class Main {
    static boolean visit(String name) {
        try (Door d = new Door(name)) {
            if (name.equals("Cops")) throw new IllegalStateException("Cops at the door");
            System.out.println(name + " is inside");
            return true;
        } catch (IllegalStateException e) {
            System.out.println("Alarm: " + e.getMessage());
            return false;
        }
    }

    public static void main(String[] args) {
        String[] visitors = {"Lance", "Cops", "Phil"};
        int safe = 0;
        for (String v : visitors) if (visit(v)) safe++;
        System.out.println("Safe visits: " + safe);
    }
}
