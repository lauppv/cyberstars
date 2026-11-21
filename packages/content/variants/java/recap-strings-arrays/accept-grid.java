public class Main {
    public static void main(String[] args) {
        String report = "XX.X/..X./XXXX";
        String[] rows = report.split("/");
        char[][] grid = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) grid[i] = rows[i].toCharArray();
        StringBuilder list = new StringBuilder();
        int total = 0;
        for (int i = 0; i < grid.length; i++) {
            int free = 0;
            for (int j = 0; j < grid[i].length; j++) {
                if (grid[i][j] != 'X') {
                    free++;
                    list.append(list.length() == 0 ? "" : ", ").append(i + 1).append('-').append(j + 1);
                }
            }
            total += free;
            System.out.printf("Level %d | %s | %d free%n", i + 1, rows[i], free);
        }
        System.out.println("Free spots: " + (list.length() == 0 ? "none" : list));
        System.out.println("Total free: " + total);
    }
}
