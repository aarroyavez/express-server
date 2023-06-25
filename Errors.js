const Errors = {
    // errors POST
    emptyRequestBody: "Solicitud con cuerpo vacío",
    invalidTaskData: "Debe proporcionar un identificador numérico y una descripción válidos",
    indicatorRepeated: "Indicador repetido. Por favor, use cualquier otro número.",
    // errors PUT
    emptyPutRequestBody: "Solicitud PUT con cuerpo vacío",
    taskNotFound: "No se encontró ninguna tarea con el identificador proporcionado",
};
  
  module.exports = Errors;
  