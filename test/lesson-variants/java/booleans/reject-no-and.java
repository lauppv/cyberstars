public class Main {
    public static void main(String[] args) {
        boolean employee = true;
        boolean workingDay = true;
        boolean guest = false;
        boolean invitation = false;
        boolean staffOk = employee ? workingDay : false;
        boolean visitorOk = guest ? invitation : false;
        if (staffOk || visitorOk) {
            System.out.println("Access granted");
        } else {
            System.out.println("Access denied");
        }
    }
}
