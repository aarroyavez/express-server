const readline = require("readline")
const express = require("express")
const app = express();
const port = 8080;

// interfaz para interactuar con el usuario en línea de comandos
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// arreglo que almacenará tareas
const tasks = []; 
// solicitudes entrantes en formato json
app.use(express.json());

app.get("/tasks", (req, res) => {
    res.json(tasks);
})

// app.get("/tasks/:indicator/:description/:completed", (req, res) => {
//     const indicator = req.params.indicator;
//     const description = req.params.description;
//     const completed = req.params.completed;

//     res.json({indicator, description, completed})
// })

app.post("/tasks", (req, res) => {
    // const body = req.body
    // res.send(body)
    const indicator = req.body.indicator;
    const repeatedTask = tasks.find((task) => task.indicator === indicator);
    if (repeatedTask) {
        return res.status(400).json({error: "Indicador inválido"});
    }

    const description = req.body.description;
    const task = {
        indicator,
        description,
        completed: false
    };
    tasks.push(task);

    res.json({mensaje: "Tarea agregada"});
});

app.delete("/tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const taskIndex = tasks.findIndex((task) => task.indicator === indicator);
    if (taskIndex != -1) {
        tasks.splice(taskIndex, 1);
        return res.json({mensaje: "Tarea eliminada correctamente"});
    }
    res.status(404).json({ error: "No es posible eliminar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo."});

});

app.put("/tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const task = tasks.find((task) => task.indicator === indicator);
    if (task) {
        task.completed = true;
        return res.json({mensaje: "Tarea completada"});
    }
    res.status(404).json({error: "No es posible completar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo."})
})

app.listen(port, () => {
    console.log("server listening on port", `${port}`)
})

const questionAsync = (question) => {
    return new Promise((resolve) => {
        readlineInterface.question(question, resolve);
    });
};

const promptAddTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Por favor, digite un indicador único para la tarea: "); // await antes de qestionAsyn para esperar la respuesta del usuario
        if (isNaN(indicator)) {
            (console.log("El indicador debe ser un número. Por favor, intenta de nuevo"))
            showMenu();
            return;
        }
        const repeatedTask = tasks.find((task) => task.indicator === indicator);
        if (repeatedTask) {
            (console.log("Ya existe una tarea con el mismo indicador. Por favor, intenta con otro número."));
            showMenu();
            return;
        }
        const description = await questionAsync("Por favor, digite una descripción para la tarea que desee agregar: ");
        const task = {
            indicator,
            description,
            completed: false
        };
        tasks.push(task);
        console.log("Tarea agregada ✅");
        resolve();
        showMenu();
    });
};

const promptCompleteTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Por favor, digite el indicador de la tarea a marcar como completada: ")
        const task = tasks.find((task) => task.indicator === indicator);
        if (task) {
            task.completed = true;
            console.log("Tarea completada ✅");
        } else {
            console.log("No es posible completar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo.");
        }
        resolve();
        showMenu();
    });
};

const promptDeleteTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Por favor, digite un indicador para la tarea que desee eliminar: ");
        const taskIndex = tasks.findIndex((task) => task.indicator === indicator);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            console.log("Tarea eliminada ✅");
        } else {
            console.log("No es posible eliminar. Ninguna tarea coincide con el indicador suministrado. Por favor, intente de nuevo.");
        }
        resolve();
        showMenu();
    });
};

const showTasks = () => {   
    console.log("Task List: ");
    tasks.forEach((task, index) => {
        console.log(`[${index}] Indicador: ${task.indicator} | Descripción: ${task.description} | Completada: ${task.completed ? "Sí" : "No"}`);
    });
    showMenu();
};

const showMenu = () => {
    console.log('\n--- MENU ---');
    console.log('1. Agregar tarea');
    console.log('2. Eliminar tarea');
    console.log('3. Marcar tarea como completada');
    console.log('4. Mostrar lista de tareas');
    console.log('5. Salir');

    readlineInterface.question('\nSeleccione una opción: ', (option) => {
        switch (option) {
            case "1":
                promptAddTask();
                break;
            case '2':
                promptDeleteTask();
                break;
            case '3':
                promptCompleteTask();
                break;
            case '4':
                showTasks();
                break;
            case '5':
                readlineInterface.close();
                break;
            default:
                console.log("INVÁLIDO. DEBE INGRESAR ESCOGER UNA DE LAS OPCIONES DEL MENÚ: 1, 2, 3, 4, 5");
                showMenu();
                break;
        }
    });
};

console.log("BIENVENIDO A LA APP PARA ADMINISTRAR TUS TAREAS");

showMenu();


