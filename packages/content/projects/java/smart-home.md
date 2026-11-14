The Schmidt family put smart plugs, smart bulbs and a radiator control all over their flat, and now each one has its own app. They want one hub: a single program that knows every device and every room, switches devices by name or a whole room at once, makes the lights dimmer, sets the radiator, and at the end of the month says how much electricity went where. Different devices can do different things, and this is exactly what Java's interfaces are for.

**How it works.** The program first reads the devices, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the hub's answers:

```text
6
light ceiling living 60
light lamp living 40
heater radiator living 2000
plug tv living 120
light desk office 30
plug fridge kitchen 150
6 devices in 3 rooms
status
living:
  ceiling (light): off
  lamp (light): off
  radiator (heater): off
  tv (plug): off
office:
  desk (light): off
kitchen:
  fridge (plug): off
on ceiling
ceiling on
on ceiling
ceiling is already on
dim lamp 50
lamp at 50%
dim tv 50
tv can't be dimmed
on radiator
radiator on
set radiator 24
radiator set to 24 C
on fridge
fridge on
status
living:
  ceiling (light): on at 100%
  lamp (light): on at 50%
  radiator (heater): on, set to 24 C
  tv (plug): off
office:
  desk (light): off
kitchen:
  fridge (plug): on
wait 60
60 min later, drawing 2230 W
off radiator
radiator off
room living off
living: 2 devices switched off
wait 120
120 min later, drawing 150 W
energy
living: 2.08 kWh
office: 0.00 kWh
kitchen: 0.45 kWh
Total: 2.53 kWh, 3.04 euros
Biggest user: radiator
quit
Hub off
```

The commands:

| Command                       | What it does                                       |
| ----------------------------- | -------------------------------------------------- |
| `status`                      | every room and its devices                         |
| `on <device>`, `off <device>` | switches one device on or off                      |
| `dim <device> <percent>`      | makes a light dimmer                               |
| `set <heater> <temperature>`  | sets a heater's temperature                        |
| `room <room> <on\|off>`       | switches the lights and heaters of a room          |
| `wait <minutes>`              | lets time go by, while the devices use electricity |
| `energy`                      | how much electricity each room used, and the cost  |
| `quit`                        | ends the program                                   |

Some words you will meet:

| Word                | What it means                                                             |
| ------------------- | ------------------------------------------------------------------------- |
| watt (W)            | how much power a device uses while it is on                               |
| kilowatt-hour (kWh) | an amount of electricity: 1000 watts for one hour                         |
| dim                 | make a light less bright, from 10 to 100%                                 |
| thermostat          | the part of a heater that keeps the room at a temperature                 |
| interface           | a list of methods a class promises to have. A class can implement several |

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one `Main.java`. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests try other flats. Passing them finishes the project.

## The devices

Read every line with a `Scanner` (`nextLine()`) and split it into words. The hub first reads the devices: how many there are, then one line for each with its kind, name, room and power in watts:

```text
6
light ceiling living 60
light lamp living 40
heater radiator living 2000
plug tv living 120
light desk office 30
plug fridge kitchen 150
```

Write an abstract class `Device` with what all devices have (name, room, watts), and three classes that extend it: `Light`, `Heater` and `Plug`. Keep the devices in a `LinkedHashMap`, with the name as the key, and keep the rooms in the order they first come.

Print `6 devices in 3 rooms`, then read commands until someone types `quit`, and print `Hub off` then. For any other word, print `Unknown command: cook`.

## Status

`status` lists every room, in order, and its devices with their kind and state, with two spaces in front:

```text
status
living:
  ceiling (light): off
  lamp (light): off
  radiator (heater): off
  tv (plug): off
office:
  desk (light): off
kitchen:
  fridge (plug): off
```

Each kind describes its own state, so give `Device` a method `state()` that each class overrides.

## On and off

Every device can be switched on and off. So write an interface `Switchable` with `setOn(boolean)` and `isOn()`, and make `Device` implement it. `on <device>` and `off <device>` switch one device:

```text
on ceiling
ceiling on
on ceiling
ceiling is already on
```

For a name that is not a device, print `No device sofa`. In `status`, a light that is on shows `on at 100%`, and every other device that is on shows just `on`.

## Dimming

Only lights can be dimmed. Write a second interface, `Dimmable`, with `dim(int percent)`, and make only `Light` implement it. `dim <device> <percent>` dims a light and switches it on:

```text
dim lamp 50
lamp at 50%
dim tv 50
tv can't be dimmed
```

Use `instanceof Dimmable` to know if a device can be dimmed, instead of checking its kind by name.

Lights go from 10 to 100%. For any other value, print `Lights dim from 10 to 100%`. A dimmed light shows `on at 50%`, and uses only that part of its watts.

## The thermostat

`set <heater> <temperature>` sets a heater's thermostat, from 5 to 30 degrees. It starts at 21:

```text
set radiator 24
radiator set to 24 C
```

For a device with no thermostat, print `lamp has no thermostat`. For a temperature outside 5 to 30, print `Heaters go from 5 to 30 C`. In `status`, a heater that is on shows `on, set to 24 C`.

## A whole room

`room <room> <on|off>` switches every light and heater in a room, but not the plugs: nobody wants the fridge switched off by mistake. Say how many devices really changed:

```text
room living off
living: 2 devices switched off
```

For one device, write `1 device`. For a room that doesn't exist, print `No room attic`.

## Time and energy

`wait <minutes>` lets time go by. Every device that is on uses its power for that long (a dimmed light, its part of it), and the hub says how much power the flat was using:

```text
wait 60
60 min later, drawing 2230 W
```

Keep the energy each device used in watt-hours: watts times minutes, divided by 60.

## The monthly bill

`energy` shows what each room used in kilowatt-hours (watt-hours divided by 1000), with two decimals. Then the total and its cost at 1.20 euros for each kWh, and the device that used the most:

```text
energy
living: 2.08 kWh
office: 0.00 kWh
kitchen: 0.45 kWh
Total: 2.53 kWh, 3.04 euros
Biggest user: radiator
```

Before any device used energy, the last line is `Biggest user: none`.

Last, make sure the program never stops with an exception:

- a command with the wrong number of words prints how to use it: `Usage: on <device>`, `Usage: dim <device> <percent>`, `Usage: set <heater> <temperature>`, `Usage: room <room> <on|off>` or `Usage: wait <minutes>`
- a number that is not a number prints `Not a number: half`
