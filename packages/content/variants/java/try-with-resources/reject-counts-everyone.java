class Door implements AutoCloseable {
    Door(String name) { System.out.println("Door opens for " + name); }
    public void close() { System.out.println("Door locks"); }
}

public class Main {
    public static void main(String[] args) {
        String[] visitors = {"Lance", "Cops", "Phil"};
        for (String name : visitors) {
            try (Door d = new Door(name)) {
                if (name.equals("Cops")) throw new IllegalStateException("Cops at the door");
                System.out.println(name + " is inside");
            } catch (IllegalStateException e) {
                System.out.println("Alarm: " + e.getMessage());
            }
        }
        System.out.println("Safe visits: " + visitors.length);
    }
}
