def add_task(tasks, name): # append a new task: {"name": name, "done": False}
pass

def complete_task(tasks, index): # mark the task at index as done
pass

def count_done(tasks): # return how many tasks have done == True
pass

tasks = []
add_task(tasks, "Run diagnostics")
add_task(tasks, "Refuel reactor")
add_task(tasks, "Chart course")
complete_task(tasks, 0)
complete_task(tasks, 2)

# display each task as "0. [done] Run diagnostics" or "1. [pending] Refuel reactor",

# then print "Completed: " + how many are done + "/" + the total
