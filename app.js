const readline = require("readline")
const express = require("express")
const app = express();
const port = 3000;

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

app.post("/tasks", (req, res) => {
    const indicator = req.body.indicator;
    const repeatedTask = tasks.find((task) => task.indicator === indicator);
    if (repeatedTask) {
        return res.status(400).json({error: "YA EXISTE UNA TAREA CON EL MISMO INDICADOR❌👉 SELECCIONA OTRO NÚMERO"});
    }

    const description = req.body.description;
    const task = {
        indicator,
        description,
        completed: false
    };
    tasks.push(task);

    res.json({mensaje: "Tarea agregada correctamente"});
});

app.delete("tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const taskIndex = tasks.findIndex((task) => task.indicator === indicator);
    if (taskIndex != -1) {
        tasks.splice(taskIndex, 1);
        return res.json({mensaje: "Tarea eliminada correctamente"});
    }
    res.status(404).json({ error:'¡NINGUNA TAREA COINCIDE CON EL INDICADOR PROPORCIONADO❗' });

});

app.put("/tasks/:indicator", (req, res) => {
    const indicator = req.params.indicator;
    const task = tasks.find((task) => task.indicator === indicator);
    if (task) {
        task.completed = true;
        return res.json({mensaje: "Tarea marcada como completada"});
    }
    res.status(404).json({error: "¡NINGUNA TAREA COINCIDE CON EL INDICADOR PROPORCIONADO❗"})
})

app.listen(port, () => {
    console.log("server listening on port", `${port}`)
})

const questionAsync = (question) => {
    return new Promise((resolve) => {
        readlineInterface.question(question, resolve);
    });
};

// Entradas del usuario desde consola
const promptAddTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Por favor, digite un indicador único para la tarea: "); // await antes de qestionAsyn para esperar la respuesta del usuario
        if (isNaN(indicator)) {
            (console.log("EL INDICADOR DEBE SER UN NÚMERO❗👉 VUELVE A INTENTAR"))
            showMenu();
            return;
        }
        const repeatedTask = tasks.find((task) => task.indicator === indicator);
        if (repeatedTask) {
            (console.log("YA EXISTE UNA TAREA CON EL MISMO INDICADOR❌👉 SELECCIONA OTRO NÚMERO"));
            showMenu();
            return;
        }
        const description = await questionAsync("Digite una descripción para la tarea que desee agregar: ");
        const task = {
            indicator,
            description,
            completed: false
        };
        tasks.push(task);
        console.log("TAREA AGREGADA CORRECTAMENTE✅");
        resolve();
        showMenu();
    });
};

const promptDeleteTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Digite un indicador para la tarea que desee eliminar: ");
        const taskIndex = tasks.findIndex((task) => task.indicator === indicator);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            console.log("TAREA ELIMINADA CORRECTAMENTE✅");
        } else {
            console.log("¡NINGUNA TAREA COINCIDE CON EL INDICADOR PROPORCIONADO❗");
        }
        resolve();
        showMenu();
    });
};

const promptCompleteTask = () => {
    return new Promise(async(resolve) => {
        const indicator = await questionAsync("Digite el indicador de la tarea a marcar como completada: ")
        const task = tasks.find((task) => task.indicator === indicator);
        if (task) {
            task.completed = true;
            console.log("TAREA MARCADA COMO COMPLETADA CORRECTAMENTE✅");
        } else {
            console.log("¡NINGUNA TAREA COINCIDE CON EL INDICADOR PROPORCIONADO❗");
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


