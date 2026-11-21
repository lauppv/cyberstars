public class Main {
    public static void main(String[] args) {
        int[][] vault = { { 100, 500, 20 }, { 0, 900, 50 } };
        int bestFloor = 0, bestSafe = 0;
        for (int floor = 0; floor < vault.length; floor++) {
            int total = 0;
            for (int safe = 0; safe < vault[floor].length; safe++) {
                total += vault[floor][safe];
                if (vault[floor][safe] >= vault[bestFloor][bestSafe]) {
                    bestFloor = floor;
                    bestSafe = safe;
                }
            }
            System.out.println("Floor " + (floor + 1) + ": " + total);
        }
        System.out.println("Best safe: floor " + (bestFloor + 1) + ", safe " + (bestSafe + 1) + ", cash " + vault[bestFloor][bestSafe]);
    }
}
