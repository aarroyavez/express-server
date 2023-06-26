const express = require("express");
const router = express.Router();
const {listTask, tasks} = require("./objects")
const Errors = require("./Errors");

// Middleware para gestionar qué los parámetros seán correctos de lo contrario debe devolver el error
const validateParams = (req, res, next) => {
    const completed = req.query.completed;
    if (completed && completed !== "true" && completed !== "false") {
        return next(Errors.invalidParameter);
    }
    next();
};

// Middleware de manejo de errores local
const errorHandler = (error, req, res, next) => {
    res.status(400).json({ error: error });
  };

// Muestra la lista de tareas existentes
router.get("/", (req, res) => {
    res.json(listTask());
})

// Rutas en para listar el estado de las tareas en un solo router
// /status?completed=true y /status?completed=false
router.get("/status", validateParams, (req, res, next) => {
    const completed = req.query.completed;

    if (completed === "true") {
        const completedTasks = tasks.filter((task) => task.completed);
        if (completedTasks.length === 0) {
            return next(Errors.incompleteTask);
        }
        res.json(completedTasks);
    } else if (completed === "false") {
        const incompleteTasks = tasks.filter((task) => !task.completed);
        res.json(incompleteTasks);
    } else {
        next(Errors.invalidRoute)
    }
});

// Aplico middleware de manejo de errores local 
router.use(errorHandler);

module.exports = router;



