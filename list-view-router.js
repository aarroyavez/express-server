/**
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están completas.
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están incompletas.
 */

const express = require("express");
const router = express.Router();
const {listTask, tasks} = require("./objects")


// Muestra la lista de tareas existentes
router.get("/", (req, res) => {
    res.json(listTask());
})

//Ruta para mostrar lista de tareas completas con params
router.get("/completed/:completed", (req, res) => {
    const completed = req.params.completed;
    if (completed === "true") {
        const completedTasks = tasks.filter((task) => task.completed);
        if (completedTasks.length === 0) {
            res.status(404).json({error: "Al momento, ninguna tarea está completa"});
        } else {
            res.json(completedTasks);
        }
    } else {
        res.status(400).json({ error: "La ruta no es válida" });
    }
});

//Ruta para mostrar lista de tareas incompletas con Params
router.get("/incompleted/:incompleted", (req, res) => {
    const incompleted = req.params.incompleted;
    if(incompleted === "true") {
        const incompleteTasks = tasks.filter((task) => !task.completed);
        res.json(incompleteTasks);
    } else {
        res.status(400).json({error: "Ruta inválida"})
    }

})

// Mostrar una tarea en específico usando params 
// router.get("/:indicator/:description/:completed", (req, res) => {
//     const indicator = req.params.indicator;
//     const description = req.params.description;
//     const completed = req.params.completed;

//     res.json({indicator, description, completed})
// })

module.exports = router;



