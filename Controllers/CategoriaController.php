<?php
include_once "../Util/Config/config.php";
include_once "../Models/Categoria.php";
session_start();

$categoria = new Categoria();

// Leer todas las categorías activas.
if ($_POST['funcion'] == "read_all_categorias") {
    $datos = $categoria->read_all_categorias();
    echo json_encode($datos);
    exit();
}

// Crear una nueva categoría.
if ($_POST['funcion'] === "crear_categoria") {
    $nombre = trim($_POST["nombre_categoria"] ?? '');
    if ($nombre === '') {
        echo "error_faltan_datos";
        exit();
    }

    // 1) ¿Ya existe?
    $cat = $categoria->existe_categoria($nombre);
    if ($cat) {
        if ($cat['estado'] === 'I') {
            // Reactiva
            $categoria->reactivar_categoria($cat['id_categoria']);
            echo "reactivada";
        } else {
            echo "categoria_existente";
        }
        exit();
    }

    // 2) No existía → la crea
    $categoria->crear_categoria($nombre);
    echo "success";
    exit();
}

// Editar una categoría existente.
if ($_POST['funcion'] === "editar_categoria") {
    $id   = $_POST['id_categoria'];
    $nombre = trim($_POST["nombre_categoria_mod"] ?? '');
    if ($nombre === '' || !$id) {
        echo "error_faltan_datos";
        exit();
    }

    // 1) ¿Otro registro ya usa este nombre?
    $cat = $categoria->existe_categoria($nombre, $id);
    if ($cat) {
        echo "categoria_existente";
        exit();
    }

    // 2) Actualiza
    $categoria->editar_categoria($id, $nombre);
    echo "success";
    exit();
}

// Eliminar (inactivar) una categoría.
if ($_POST['funcion'] == "eliminar_categoria") {
    if (!empty($_POST['id_categoria'])) {
        $id_categoria = $_POST['id_categoria'];
        $resultado = $categoria->eliminar_categoria($id_categoria);
        
        if ($resultado) {
            echo "success";
        } else {
            echo "error_existen_productos";
        }
    } else {
        echo "error_faltan_datos";
    }
    exit();
}

// Lee y luego llena todas las categorias en un select
if ($_POST['funcion'] == "llenar_categorias") {
    // Se asume que el método obtener_categorias
    // llena la propiedad $objetos del objeto $categoria.
    $categoria->obtener_categorias();
    echo json_encode($categoria->objetos);
    exit();
}
