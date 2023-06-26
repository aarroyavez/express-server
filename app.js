const express = require("express")
const app = express();
const port = 8080;
// Importar módulos de enrutamiento
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

// Middleware para validar el método http
const validateMethod = (req, res, next) => {
    const validsMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!validsMethods.includes(req.method)) {
        return res.status(405).json({ error: "Método HTTP no válido"});
    }
    next();
};

// Middleware para manejo global de errores
const errorHandler = (error, req, res, next) => {
    console.log(error);
    res.status(500).json({ error: "Serve error"});
};

// solicitudes entrantes en formato json
app.use(express.json());

// Aplicar Middleware de validación de método HTTP
app.use(validateMethod);

// Registrar módulos de enrutamiento
app.use("/tasks", listViewRouter);
app.use("/tasks", listEditRouter);

// Aplicar middleware de manejo global de errores
app.use(errorHandler);
// Servidor escuchando
app.listen(port, () => {
    console.log("Servidor corriendo en puerto", `${port}`)
});



