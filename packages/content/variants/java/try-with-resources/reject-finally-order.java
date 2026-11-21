class Door implements AutoCloseable {
    Door(String name) { System.out.println("Door opens for " + name); }
    public void close() { System.out.println("Door locks"); }
}

public class Main {
    public static void main(String[] args) {
        String[] visitors = {"Lance", "Cops", "Phil"};
        int safe = 0;
        for (String name : visitors) {
            Door d = new Door(name);
            try {
                if (name.equals("Cops")) throw new IllegalStateException("Cops at the door");
                System.out.println(name + " is inside");
                safe++;
            } catch (IllegalStateException e) {
                System.out.println("Alarm: " + e.getMessage());
            } finally {
                d.close();
            }
        }
        System.out.println("Safe visits: " + safe);
    }
}
