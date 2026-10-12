public class Main {
    public static void main(String[] args) {
        boolean employee = true;
        boolean workingDay = true;
        boolean guest = false;
        boolean invitation = false;
        if (employee && workingDay) {
            System.out.println("Access granted");
        } else if (guest) {
            System.out.println("Access granted");
        } else {
            System.out.println("Access denied");
        }
    }
}
