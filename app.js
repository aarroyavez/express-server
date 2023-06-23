const express = require("express")
const app = express();
const port = 8080;
// Importar módulos de enrutamiento
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

// solicitudes entrantes en formato json
app.use(express.json());

// Registrar módulos de enrutamiento
app.use("/tasks", listViewRouter);
app.use("/tasks", listEditRouter);

// Servidor escuchando
app.listen(port, () => {
    console.log("Servidor corriendo en puerto", `${port}`)
})



