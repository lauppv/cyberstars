public class Main {
    static class Door implements AutoCloseable {
        Door(String who) { System.out.println("Door opens for " + who); }
        @Override
        public void close() { System.out.println("Door locks"); }
    }

    public static void main(String[] args) {
        String[] visitors = {"Lance", "Cops", "Phil"};
        int inside = 0;
        for (int i = 0; i < visitors.length; i++) {
            String who = visitors[i];
            try (Door ignored = new Door(who)) {
                if ("Cops".equals(who)) throw new IllegalStateException("Cops at the door");
                System.out.println(who + " is inside");
                inside++;
            } catch (RuntimeException e) {
                System.out.println("Alarm: " + e.getMessage());
            }
        }
        System.out.println("Safe visits: " + inside);
    }
}
