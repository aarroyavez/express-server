const express = require("express")
const app = express();
const Errors = require("./Errors");
// Importar módulos de enrutamiento
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

// Middleware para validar el método http
const validateMethod = (req, res, next) => {
    const validsMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!validsMethods.includes(req.method)) {
        return res.status(405).json({ error: Errors.invalidMethod});
    }
    next();
};

// Middleware para manejo global de errores
const errorHandler = (error, req, res, next) => {
    console.log(error);
    res.status(500).json({ error: "Serve error"});
};
// Middleware para analizar y recibir solicitudes en formato JSON
app.use(express.json());

// Aplicar Middleware de validación de método HTTP a todas las rutas
app.use(validateMethod);

// Registrar módulos de enrutamiento
app.use("/tasks", listViewRouter);
app.use("/tasks", listEditRouter);

// Aplicar middleware de manejo global de errores a todas las rutas
app.use(errorHandler);

// Servidor escuchando en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080")
});



