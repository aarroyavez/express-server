const express = require("express");
const app = express();
const router = express.Router();

/**
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están completas.
 * Hacer una solicitud GET a una ruta específica para listar las tareas que están incompletas.
 */

router.get("/completed", (req, res) => {
    const completedTasks = tasks.filter((task) => task.completed);
    res.json(completedTasks);
})

module.exports = router;