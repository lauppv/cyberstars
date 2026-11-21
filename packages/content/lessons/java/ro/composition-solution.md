```java
class Motor {
    int putere;

    Motor(int putere) {
        this.putere = putere;
    }
}

class Barca {
    String nume;
    Motor motor;

    Barca(String nume, Motor motor) {
        this.nume = nume;
        this.motor = motor;
    }

    int viteza() {
        return motor.putere / 10;
    }

    void schimbaMotor(Motor motorNou) {
        motor = motorNou;
    }
}

public class Main {
    public static void main(String[] args) {
        String nume = "Squalo";
        int putere1 = 300;
        int putere2 = 450;

        Barca barca = new Barca(nume, new Motor(putere1));
        System.out.println(barca.nume + ": " + barca.viteza() + " noduri");
        barca.schimbaMotor(new Motor(putere2));
        System.out.println(barca.nume + ": " + barca.viteza() + " noduri");
    }
}
```
