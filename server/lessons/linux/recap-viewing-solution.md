```bash
cat summary.log
head -n 3 events.log
tail -n 3 events.log
wc -l errors.log
```

```text
$ cat summary.log
All checks passed.
Ready for launch.

$ head -n 3 events.log
event 1: power on
event 2: doors locked
event 3: engines warm

$ tail -n 3 events.log
event 4: course set
event 5: liftoff
event 6: orbit reached

$ wc -l errors.log
3 errors.log
```
