```bash
grep -c info system.log
grep -v warning system.log
grep -n warning system.log
mkdir handoff
cp system.log handoff/night-brief.log
```

```text
3
info: boot complete
info: crew aboard
error: sensor 3 offline
info: orbit stable
2:warning: hull temperature rising
4:warning: fuel reserve low
7:warning: comms latency high
```
