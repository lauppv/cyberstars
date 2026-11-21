public class Main {
    public static void main(String[] args) {
        Object[] evidence = { "knife", 3, "photo", 10 };
        int texts = 0, sum = 0;
        for (int i = 0; i < evidence.length; i++) {
            Object thing = evidence[i];
            String kind = thing.getClass().getSimpleName();
            System.out.println(kind + ": " + thing);
            if (thing instanceof Integer) {
                Integer n = (Integer) thing;
                sum = sum + n;
            }
            if (thing instanceof String) texts++;
        }
        System.out.println("Text items: " + texts);
        System.out.println("Number sum: " + sum);
    }
}
