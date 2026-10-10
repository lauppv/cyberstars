public class Main {
    public static void main(String[] args) {
        boolean employee = true;
        boolean workingDay = true;
        boolean guest = false;
        boolean invitation = false;

        boolean staffOk = employee && workingDay;
        boolean visitorOk = guest && invitation;
        String msg;
        if (staffOk || visitorOk) {
            msg = "Access granted";
        } else {
            msg = "Access denied";
        }
        System.out.println(msg);
    }
}
