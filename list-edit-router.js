const express = require("express");
const router = express.Router();
const {tasks, Task, addTask, repeateTask, deleteTask, completeTask} = require("./objects");
const Errors = require("./Errors");
const Messages = require("./Messages");

// middleware de manejo de errores
const middError = (error, req, res, next) => {
    res.status(400).json({error: error});
}

// Agregar una tarea nueva (el indicador y la descripción se envían en el cuerpo de la solicitud)
router.post("/", (req, res, next) => {
   const {id, description} = req.body;

    if (!id || isNaN(id) || !description) {
        return next(Errors.invalidTaskData)
    }
    if (repeateTask(id)) {
        return next(Errors.indicatorRepeated)
    }
    const task = new Task(id, description, false) 
    addTask(task)
    res.json({ mensaje: Messages.taskAdded });
});

// Eliminar tarea por id 
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    deleteTask(id);  
    return res.json({ message: Messages.taskDeleted });
});

// Completar tarea por id
router.put("/:id", (req, res, next) => {
    const id = req.params.id;
    const task = tasks.find((task) => task.id === id);
    if (task) {
        completeTask(task.id); 
        return res.json({ message: Messages.taskCompleted });
    }
    next(Errors.taskNotFound);
});

// Agrego middleware para manejo de errores

router.use(middError);


module.exports = router;
