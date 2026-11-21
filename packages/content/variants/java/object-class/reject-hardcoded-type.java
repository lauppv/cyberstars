public class Main {
    public static void main(String[] args) {
        Object[] evidence = { "knife", 3, "photo", 10 };
        int texts = 0, sum = 0;
        for (Object item : evidence) {
            if (item instanceof String) {
                System.out.println("String: " + item);
                texts++;
            } else {
                System.out.println("Number: " + item);
                sum += (Integer) item;
            }
        }
        System.out.println("Text items: " + texts);
        System.out.println("Number sum: " + sum);
    }
}
