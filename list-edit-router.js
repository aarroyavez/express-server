const express = require("express");
const router = express.Router();
const {tasks, Task, addTask, repeateTask, deleteTask, completeTask} = require("./objects");
const Errors = require("./Errors");
const Messages = require("./Messages");

// middleware de manejo de errores
const middError = (err, req, res, next) => {
    res.status(400).json({error: err});
}

// POST -> Agregar una tarea nueva (el indicador y la descripción se envían en el cuerpo de la solicitud)
router.post("/", (req, res, next) => {
    // Error de cuerpo vacío
   if (!req.body || Object.keys(req.body).length === 0) {
    return next(Errors.emptyRequestBody)
   }
   // Extraer id y description de req.body
   const {id, description} = req.body;
   // Error para id que no sea número o id vacío o descripción vacía 
    if (!id || isNaN(id) || !description) {
        return next(Errors.invalidTaskData)
    }
    // Error para id repetido
    if (repeateTask(id)) {
        return next(Errors.indicatorRepeated)
    }
    const task = new Task(id, description, false) 
    addTask(task)
    res.json({ message: Messages.taskAdded });
});

// DELETE -> Eliminar tarea por id 
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    deleteTask(id);  
    return res.json({ message: Messages.taskDeleted });
});

// PUT -> Completar tarea por id
router.put("/:id", (req, res, next) => {
    // Error de cuerpo vacío
    if(!req.body || Object.keys(req.body).length === 0) {
        // Error si el cuerpo está vacío
        return next(Errors.emptyRequestBody)
    }

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
