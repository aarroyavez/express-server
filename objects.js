const createTask = function(id, description, completed) {
  return {
    id: id,
    description: description,
    completed: completed,
  };
}

const tasks = [];

const addTask = function(task) {
    tasks.push(task)
}

const listTask = function() {
    return tasks
}

const deleteTask = function(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    }
}

const repeateTask = function(id) {
    return tasks.some(task => task.id === id);
};

const completeTask = function(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
    }
}

const users = [
    {
        id: 1,
        username: "usuario-uno",
        password: "12345"
    },
    {
        id: 2,
        username: "usuario-2",
        password: "678910"
    }
]


module.exports = {createTask, tasks, addTask, listTask, deleteTask, repeateTask, completeTask, users}
