The Popescu family put smart plugs, bulbs and a radiator controller all over their flat, and now each one has its own app. They want one hub: a single program that knows every device and room, switches them by name or a room at a time, dims the lights, sets the radiator, and at the end of the month says how much electricity went where. Different devices can do different things, which is exactly what Java's interfaces are for.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The devices

The hub starts by reading the devices: how many, then one line each with its kind, name, room and power in watts:

```text
6
light ceiling living 60
light lamp living 40
heater radiator living 2000
plug tv living 120
light desk office 30
plug fridge kitchen 150
```

Write an abstract class `Device` with what all of them have (name, room, watts) and three subclasses, `Light`, `Heater` and `Plug`. Keep the devices in a `LinkedHashMap` by name, and the rooms in the order they first appear.

Print `6 devices in 3 rooms`, then keep reading commands until someone types `quit`, and print `Hub off` then. Any other word prints `Unknown command: cook`.

## Status

`status` lists every room, in order, and its devices with their kind and state, indented by two spaces:

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

Each kind describes its own state, so give `Device` a `state()` method that subclasses override.

## On and off

Every device can be switched, so declare an interface `Switchable` with `setOn(boolean)` and `isOn()`, and have `Device` implement it. `on <device>` and `off <device>` switch one:

```text
on ceiling
ceiling on
on ceiling
ceiling is already on
```

A name that isn't a device prints `No device sofa`. A light that's on shows `on at 100%` in `status`, everything else just `on`.

## Dimming

Only lights can be dimmed. Declare a second interface, `Dimmable`, with `dim(int percent)`, and let only `Light` implement it. `dim <device> <percent>` dims a light and switches it on:

```text
dim lamp 50
lamp at 50%
dim tv 50
tv can't be dimmed
```

Use `instanceof Dimmable` to find out whether a device can do it, rather than checking its kind by name. Lights go from 10 to 100%: anything else prints `Lights dim from 10 to 100%`. A dimmed light shows `on at 50%` and uses only that share of its watts.

## The thermostat

`set <heater> <temperature>` sets a heater's thermostat, from 5 to 30 degrees, 21 to start with:

```text
set radiator 24
radiator set to 24 C
```

A device without a thermostat prints `lamp has no thermostat`, and a temperature outside the range `Heaters go from 5 to 30 C`. A heater that's on shows `on, set to 24 C` in `status`.

## A whole room

`room <room> <on|off>` switches every light and heater in a room, leaving the plugs alone (nobody wants the fridge switched off by accident). Say how many devices actually changed:

```text
room living off
living: 2 devices switched off
```

A room that doesn't exist prints `No room attic`.

## Time and energy

`wait <minutes>` lets time pass. Every device that's on uses its power for that long (a dimmed light its share), and the hub says what the flat was drawing:

```text
wait 60
60 min later, drawing 2230 W
```

Keep the energy each device used in watt-hours: watts times minutes divided by 60.

## The monthly bill

`energy` shows what each room used in kilowatt-hours (watt-hours divided by 1000), with two decimals, then the total and its cost at 1.20 lei a kWh, and the device that used the most:

```text
energy
living: 2.08 kWh
office: 0.00 kWh
kitchen: 0.45 kWh
Total: 2.53 kWh, 3.04 lei
Biggest user: radiator
```

Before anything used energy, the last line is `Biggest user: none`. Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: on <device>`, `Usage: dim <device> <percent>`, `Usage: set <heater> <temperature>`, `Usage: room <room> <on|off>`, `Usage: wait <minutes>`), and a number that isn't one prints `Not a number: half`.
