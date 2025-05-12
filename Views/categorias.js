$(document).ready(function(){

    Loader();
    //setTimeout(verificar_sesion,2000);
    verificar_sesion();

    // Cargar Pagina
    async function verificar_sesion() {
        funcion = "verificar_sesion";
        let data = await fetch("../Controllers/UsuarioController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                if (response != "") {
                    let sesion = JSON.parse(response);
    
                    // 🔒 Validación de tipo de usuario
                    if (sesion.id_tipo_usuario != 1 && sesion.id_tipo_usuario != 3) {
                        Swal.fire({
                            icon: "error",
                            title: "Acceso denegado",
                            text: "No tienes permiso para acceder a esta sección."
                        }).then(() => {
                            window.location.href = "../index.php";
                        });
                        return;
                    }
    
                    llenar_menu_superior(sesion);
                    llenar_menu_lateral(sesion);
                    $("#active_nav_categorias").addClass("active");
                    $("#usuario_menu").text(sesion.nombre);
                    read_favoritos();
                    read_carrito()
                    read_all_categorias();
                } else {
                    // 🔐 No hay sesión → redirigir al login
                    Swal.fire({
                        icon: "info",
                        title: "Sesión no iniciada",
                        text: "Por favor inicia sesión para acceder.",
                    }).then(() => {
                        window.location.href = "../Views/login.php";
                    });
                }
    
                CloseLoader();
            } catch (error) {
                console.error("Error en verificar_sesion:", error);
            }
    
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }   

    async function read_all_categorias() {
        const funcion = "read_all_categorias";
        let data = await fetch("../Controllers/CategoriaController.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "funcion=" + funcion
        });
        
        if (data.ok) {
            let response = await data.text();
            try {
                let categorias = JSON.parse(response);
                
                $("#categoria").DataTable({
                    data: categorias,
                    "aaSorting": [],
                    "searching": true,
                    "scrollX": true,
                    "autoWidth": false,
                    "responsive": true,
                    columns: [
                        { data: "nombre_categoria" },
                        {
                            "render": function (data, type, dato, meta) {
                                return `<button id_categoria="${dato.id_categoria}" nombre_categoria="${dato.nombre_categoria}" class="edit btn btn-info" title="Editar categoria" type="button" data-bs-toggle="modal" data-bs-target="#modal_editar_categoria">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button id_categoria_mod="${dato.id_categoria}" class="remove btn btn-danger" title="Eliminar categoria">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>`;
                            }
                        }
                    ],
                    "destroy": true,
                    "language": espanol
                });
    
                $(document).on("click", ".edit", function () {
                    const id_categoria = $(this).attr("id_categoria");
                    const nombre_categoria = $(this).attr("nombre_categoria");
                    $("#modal_editar_categoria #id_categoria_mod").val(id_categoria);
                    $("#modal_editar_categoria #nombre_categoria_mod").val(nombre_categoria);
                    $("#nombre_categoria").val(nombre_categoria);
                });
                    //console.log("Valor en el campo id_categoria_mod:", $("#id_categoria_mod").val());
                    //console.log("Valor en el campo nombre_categoria:", $("#nombre_categoria_mod").val());
            } catch (error) {
                //console.error("Error al parsear el JSON:", error);
                //console.log("Respuesta del servidor:", response);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: data.statusText,
                text: "Hubo conflicto de código: " + data.status,
            });
        }
    }

    // AMB Categoria
    // Crear Categoria
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion="crear_categoria";
            let nombre_categoria = $("#nombre_categoria").val();
            $.post("../Controllers/CategoriaController.php",{funcion,nombre_categoria},(response)=>{
                response = $.trim(response);
                //console.log(">>> respuesta cruda:", JSON.stringify(response));
                if (response == "success") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Se ha creado la nueva categoría",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function(){
                        $('#modal_crear_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "reactivada") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Categoría reactivada correctamente",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function(){
                        $('#modal_crear_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "categoria_existente") {
                    Swal.fire({
                        icon: "warning",
                        title: "Duplicado",
                        text: "Ya existe una categoría activa con ese nombre",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo conflicto al agregar la categoría",
                    });
                }                
            })
        }
    });

    $('#form-categoria').validate({
        rules: {
            nombre_categoria: {
                required: true,
            },
        },
        messages: {
            nombre_categoria: {
                required: "Ingrese un nombre",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        }
    });

    // Editar Categoria
    $.validator.setDefaults({
        submitHandler: function () {
            let funcion = "editar_categoria";
            let id_categoria = $("#id_categoria_mod").val(); 
            let nombre_categoria_mod = $("#nombre_categoria_mod").val();  
            ////console.log("Enviando nombre_categoria_mod: " + nombre_categoria_mod);
            $.post("../Controllers/CategoriaController.php", {funcion, id_categoria, nombre_categoria_mod}, (response) => {
                ////console.log(response)
                if (response == "success") {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Se han editado sus datos",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(function () {
                        $('#modal_editar_categoria').modal('hide');
                        verificar_sesion();
                    });
                } else if (response == "categoria_existente") {
                    Swal.fire({
                        icon: "warning",
                        title: "Duplicado",
                        text: "Ya existe una categoría con ese nombre",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo conflicto al editar la categoría",
                    });
                }
            });
        }
    });

    $('#form-editar-categoria').validate({
        rules: {
            nombre_categoria_mod: {
                required: true,
            },
        },
        messages: {
            nombre_categoria_mod: {
                required: "Ingrese un nombre",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
            $(element).removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
            $(element).addClass('is-valid');
        }
    });

    // Eliminar Categoria
    $(document).on("click", ".remove", function () {
        const id_categoria = $(this).attr("id_categoria_mod");
        ////console.log("ID Categoría enviada:", id_categoria);

        Swal.fire({
            title: "¿Desea desactivar la categoría?",
            text: "Podrá reactivar la categoría desde la base de datos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Inactivar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("../Controllers/CategoriaController.php", { 
                    funcion: "eliminar_categoria", 
                    id_categoria: id_categoria 
                }, function(response) {
                    ////console.log("Respuesta:", response);
                    if (response.trim() === "success") {
                        Swal.fire({
                            title: "Inactivada",
                            text: "Categoría inactiva",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(function () {
                            read_all_categorias();
                        });
                    } else if(response.trim() === "error_existen_productos") {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se puede borrar la categoría. Existen productos activos asociados.",
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al inactivar la categoría.",
                        });
                    }
                });
            }
        });
    });
})
