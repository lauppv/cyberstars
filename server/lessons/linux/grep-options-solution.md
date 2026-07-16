```bash
grep -c warning system.log
grep -v info system.log
grep -n error system.log
mkdir handoff
cp system.log handoff/night-brief.log
```

```text
3
warning: hull temperature rising
warning: fuel reserve low
error: sensor 3 offline
warning: comms latency high
5:error: sensor 3 offline
```
