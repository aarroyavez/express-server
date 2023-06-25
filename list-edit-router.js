const express = require("express");
const router = express.Router();
const {tasks, Task, addTask, repeateTask, deleteTask, completeTask} = require("./objects")

// middleware de manejo de errores
const middError = (error, req, res, next) => {
    res.status(400).json({error: error.message});
}

// Agrego middleware para manejo de errores
router.use(middError);

// Agregar una tarea nueva (el indicador y la descripción se envían en el cuerpo de la solicitud)
router.post("/", (req, res, next) => {
   const {id, description} = req.body;

    if (!id || isNaN(id) || !description) {
        return next (new Error("Debe proporcionar un identificador numérico y una descripción válidos" ));
    }

    if (repeateTask(id)) {
        return next(new Error("Indicador repetido. Por favor, use cualquier otro número. "))
    }

    const task = new Task(id, description, false) 
    addTask(task)

    res.json({ mensaje: "Tarea agregada correctamente" });
});

// Eliminar tarea por id 
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    deleteTask(id);  
    return res.json({ mensaje: "Tarea eliminada correctamente" });
});

// Completar tarea por id
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find((task) => task.id === id);
    if (task) {
        completeTask(task.id); 
        return res.json({ mensaje: "Tarea completada" });
    }
    res.status(404).json({ error: "No es posible completar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo." });
});

module.exports = router;
