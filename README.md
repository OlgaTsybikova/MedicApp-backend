Una app fullstack MERN con las siguientes características:

Listado de items
Detalle de item (página aparte)
Crear item (página aparte)
Modificar item (mismo formulario que para crear)
Borrar item
Paginación
Filtros
Login y registro de usuario
Feedbacks al usuario
Gestión de errores
Firebase para los archivos


[GET] /medications/ --> devuelve todos los medicamentos

[GET] /medications/:medicationId --> devuelve un medicamento (detalle)


[POST] /user/register -> recibe en el body las credenciales name, username y password

[POST] /user/login -> recibe en el body las credenciales username y password


[GET] /medications/categories/--> devuelve todos los medicamentos de una categoria

[POST] /medications: para crear un nuevo medicamento

[PUT] /medications/:idMedication : para actualizar un medicamento

[DELETE] /medications/:idMedication : para borrar un medicamento

