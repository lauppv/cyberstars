def addTask(todos, name): # add a new task dict with name and done=False
pass

def completeTask(todos, index): # mark the task at index as done
pass

def countDone(todos): # return how many tasks have done=True
pass

todos = []
addTask(todos, "Learn Python")
addTask(todos, "Learn Java")
addTask(todos, "Learn C")

print(len(todos))

completeTask(todos, 0)
print(countDone(todos))

completeTask(todos, 2)
print(countDone(todos))
