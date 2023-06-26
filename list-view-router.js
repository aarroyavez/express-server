/**
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están completas.
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están incompletas.
 */

const express = require("express");
const router = express.Router();
const {listTask, tasks} = require("./objects")

// Middleware para gestionar qué los parámetros seán correctos de lo contrario debe devolver el error
const validateParams = (req, res, next) => {
    const completed = req.query.completed;

    if (completed && completed !== "true" && completed !== "false") {
        return res.status(400).json({ error: "Párametro no válido"});
    }

    next();
}

// Muestra la lista de tareas existentes
router.get("/", (req, res) => {
    res.json(listTask());
})


// Rutas en para listar el estado de las tareas en un solo router
// /status?completed=true y /status?completed=false
router.get("/status", validateParams, (req, res) => {
    const completed = req.query.completed;

    if (completed === "true") {
        const completedTasks = tasks.filter((task) => task.completed);
        if (completedTasks.length === 0) {
            res.status(400).json({ error: "Al momento, ninguna tarea está completa" });
        } else {
            res.json(completedTasks);
        }
    } else if (completed === "false") {
        const incompleteTasks = tasks.filter((task) => !task.completed);
        res.json(incompleteTasks);
    } else {
        res.status(400).json({ error: "Ruta no válida"});
    }
});


// //Ruta para mostrar lista de tareas completas con params
// funciona con la ruta /tasks/status?completed=true
// router.get("/status", (req, res) => {
//     const completed = req.query.completed === "true";
//     if (completed) {
//         const completedTasks = tasks.filter((task) => task.completed);
//         if (completedTasks.length === 0) {
//             res.status(404).json({error: "Al momento, ninguna tarea está completa"});
//         } else {
//             res.json(completedTasks);
//         }
//     } else {
//         res.status(400).json({ error: "La ruta no es válida" });
//     }
// });

// //Ruta para mostrar lista de tareas incompletas con Params
//no funciona 
// router.get("/status", (req, res) => {
//     const incompleted = req.query.incompleted === "true";
//     if(incompleted) {
//         const incompleteTasks = tasks.filter((task) => !task.completed);
//         res.json(incompleteTasks);
//     } else {
//         res.status(400).json({error: "Ruta inválida"})
//     }

// })

// Mostrar una tarea en específico usando params 
// router.get("/:indicator/:description/:completed", (req, res) => {
//     const indicator = req.params.indicator;
//     const description = req.params.description;
//     const completed = req.params.completed;

//     res.json({indicator, description, completed})
// })

module.exports = router;



