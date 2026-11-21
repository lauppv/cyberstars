public class Main {
    public static void main(String[] args) {
        String results = "Tommy:120;Lance:85;Ken:40";
        String[] records = results.split(";");
        int total = 0;
        int bestIndex = 0;
        int[] scores = new int[records.length];
        for (int i = 0; i < records.length; i++) {
            String name = records[i].split(":")[0];
            scores[i] = Integer.parseInt(records[i].split(":")[1]);
            System.out.println(name + " - " + scores[i]);
            total = total + scores[i];
            if (scores[i] > scores[bestIndex]) bestIndex = i;
        }
        System.out.println("Total: " + total);
        System.out.println("Best: " + records[bestIndex].split(":")[0]);
    }
}
