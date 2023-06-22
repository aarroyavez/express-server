const express = require("express")
const app = express();
const port = 8080;
const lastViewRouter = require("./list-view-router");

// arreglo que almacenará tareas
const tasks = []; 
// solicitudes entrantes en formato json
app.use(express.json());

app.use("tasks", lastViewRouter)

// Muestra la lista de tareas existentes
app.get("/tasks", (req, res) => {
    res.json(tasks);
})

// Ruta para mostrar lista de tareas completas con params
app.get("/tasks/:completed", (req, res) => {
    const completed = req.params.completed;
    if (completed === "completed") {
        const completedTasks = tasks.filter((task) => task.completed);

        if (completedTasks.length === 0) {
            res.status(404).json({error: "Al momento, ninguna tarea está completa"});
        } else {
            res.json(completedTasks);
        }
    } else {
        res.status(404).json({ error: "La ruta no es válida" });
    }
});

// Ruta para mostrar lista de tareas incompletas con Params
app.get("/tasks/:incompleted", (req, res) => {
    const incompleted = req.params.incompleted;

    if(incompleted === "incompleted") {
        const incompleteTasks = tasks.filter((task) => !task.completed);
        res.json(incompleteTasks);
    } else {
        res.status(404).json({error: "La ruta no es válida"})
    }

})

// Mostrar una tarea en específico usando params 
app.get("/tasks/:indicator/:description/:completed", (req, res) => {
    const indicator = req.params.indicator;
    const description = req.params.description;
    const completed = req.params.completed;

    res.json({indicator, description, completed})
})
    
// Agregar una tarea nueva (el indicador y la descripción se envían en el cuerpo de la solicitud)
app.post("/tasks", (req, res) => {
    const indicator = req.body.indicator;
    const description = req.body.description;

    if (!indicator || isNaN(indicator) || !description) {
        return res.status(400).json({ error: "Debe proporcionar un identificador numérico y una descripción válidos" });
    }

    const invalidTask = tasks.find((task) => task.indicator === indicator);
    if (invalidTask) {
        return res.status(404).json({ error: "Indicador repetido" });
    }

    const task = {
        indicator,
        description,
        completed: false
    };
    tasks.push(task);

    res.json({ mensaje: "Tarea agregada correctamente" });
});

app.delete("/tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const taskIndex = tasks.findIndex((task) => task.indicator === indicator);
    if (taskIndex != -1) {
        tasks.splice(taskIndex, 1);
        return res.json({mensaje: "Tarea eliminada correctamente"});
    }
    res.status(404).json({ error: "No es posible eliminar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo."});

});

app.put("/tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const task = tasks.find((task) => task.indicator === indicator);
    if (task) {
        task.completed = true;
        return res.json({mensaje: "Tarea completada"});
    }
    res.status(404).json({error: "No es posible completar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo."})
})

app.listen(port, () => {
    console.log("Servidor corriendo en puerto", `${port}`)
})

module.exports = tasks;


