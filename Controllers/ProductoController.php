<?php
include_once "../Util/Config/config.php";
include_once "../Models/Producto.php";

$producto = new Producto();
session_start();

// Leer todos los productos
if ($_POST["funcion"] == "read_all_productos") {
    $producto->read_all_productos();
    $json = array();
    foreach ($producto->objetos as $objeto) {
        $json[] = array(
            "id_producto"      => openssl_encrypt($objeto->id_producto, CODE, KEY),
            "nombre_producto"  => $objeto->nombre_producto,
            "precio_venta"     => $objeto->precio_venta,
            "descripcion"      => $objeto->descripcion,
            "imagen_principal" => $objeto->imagen_principal,
            "id_categoria"     => $objeto->id_categoria,
            "nombre_categoria" => $objeto->nombre_categoria,
            "estado"           => $objeto->estado,
            "stock"            => $objeto->stock,
            "fecha_creacion"   => $objeto->fecha_creacion,
            "fecha_edicion"    => $objeto->fecha_edicion
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}

// Crear un nuevo producto (con validación de duplicados y reactivación)
if ($_POST["funcion"] == "crear_producto") {
    $nombre_producto     = $_POST["nombre_producto"];
    $categoria_producto  = $_POST["categoria_producto"];
    $descripcion_producto = $_POST["descripcion_producto"];
    $precio_producto     = $_POST["precio_producto"];
    $stock               = $_POST["stock"];

    // 1) Verificar si ya existe (activo o inactivo)
    $prod_existente = $producto->existe_producto($nombre_producto);
    if ($prod_existente) {
        if ($prod_existente['estado'] === 'I') {
            // Reactivar si estaba inactivo
            $producto->reactivar_producto($prod_existente['id_producto']);
            echo "reactivada";
        } else {
            // Ya existe activo
            echo "producto_existente";
        }
        exit();
    }

    // 2) Validación de categoría
    if (empty($categoria_producto)) {
        echo "error_categoria";
        exit();
    }

    // 3) Procesar imagen
    if (isset($_FILES["imagen_producto"])) { 
        $imagen        = $_FILES["imagen_producto"];
        $ext           = pathinfo($imagen["name"], PATHINFO_EXTENSION);
        $imagen_final  = uniqid() . "." . $ext;
        $destino       = "../Util/Img/productos/" . $imagen_final;

        if ($imagen["error"] === UPLOAD_ERR_OK) {
            move_uploaded_file($imagen["tmp_name"], $destino);
        } else {
            echo "error_imagen";
            exit();
        }
    } else {
        echo "error_imagen2";
        exit();
    }

    // 4) Crear producto
    $producto->crear_producto(
        $nombre_producto,
        $categoria_producto,
        $descripcion_producto,
        $precio_producto,
        $imagen_final,
        $stock
    );
    echo "success";
    exit();
}

// Editar un producto (evitar renombrar a uno ya existente)
if ($_POST["funcion"] == "editar_producto") {
    // 1) Desencriptar ID
    $formateado  = str_replace(" ", "+", $_POST["id_producto"]);
    $id_producto = openssl_decrypt($formateado, CODE, KEY);

    // 2) Leer y limpiar campos
    $nombre_producto      = trim($_POST["nombre_producto"]);
    $categoria_producto   = $_POST["categoria_producto"];
    $descripcion          = $_POST["descripcion"];
    $precio_venta         = $_POST["precio_venta"];
    $stock                = $_POST["stock"];
    $imagen_actual        = $_POST["imagen_actual"] ?? null;

    

    if ($producto->existe_otro_producto_con_nombre($nombre_producto, $id_producto)) {
        echo "producto_existente";
        exit();
    }

    // 4) Procesar posible nueva imagen
    $directorio    = "../Util/Img/productos/";
    $imagen_final  = $imagen_actual;
    if (isset($_FILES["imagen_principal_mod"]) && $_FILES["imagen_principal_mod"]["error"] === UPLOAD_ERR_OK) {
        $img    = $_FILES["imagen_principal_mod"];
        $ext    = strtolower(pathinfo($img["name"], PATHINFO_EXTENSION));
        $permit = ['jpg','jpeg','png','gif'];
        if (in_array($ext, $permit)) {
            $nuevoNombre = uniqid() . "." . $ext;
            if (move_uploaded_file($img["tmp_name"], $directorio . $nuevoNombre)) {
                if ($imagen_actual && file_exists($directorio . $imagen_actual)) {
                    unlink($directorio . $imagen_actual);
                }
                $imagen_final = $nuevoNombre;
            } else {
                echo "error_subir_imagen";
                exit();
            }
        } else {
            echo "error_extension_imagen";
            exit();
        }
    }

    // 5) Actualizar y responder
    ob_clean();
    $ok = $producto->editar_producto(
        $id_producto,
        $nombre_producto,
        $categoria_producto,
        $descripcion,
        $precio_venta,
        $imagen_final,
        $stock
    );
    if ($ok === true) {
        echo "success";
    } else {
        echo "error_actualizar";
    }
}

// Obtener información de un producto
if ($_POST['funcion'] == 'obtener_producto') {
    $id_producto = $_POST['id_producto'];
    $formateado_id_producto = str_replace(" ", "+", $id_producto);
    $id_producto_decrypt = openssl_decrypt($formateado_id_producto, CODE, KEY);

    $productos = $producto->obtener_producto($id_producto_decrypt);

    $producto_info = $productos[0];

    $json = array(
        "id_producto" => openssl_encrypt($producto_info->id_producto, CODE, KEY),
        "nombre_producto" => $producto_info->nombre_producto,
        "precio_venta" => $producto_info->precio_venta,
        "descripcion" => $producto_info->descripcion,
        "imagen_principal" => $producto_info->imagen_principal,
        "id_categoria" => $producto_info->id_categoria,
        "nombre_categoria" => $producto_info->nombre_categoria,
        "estado" => $producto_info->estado,
        "stock" => $producto_info->stock   // Agregado aquí
    );
    
    echo json_encode($json);
}

// Obtener las imágenes de un producto
if ($_POST['funcion'] == "obtener_imagenes") {
    $formateado = str_replace(" ","+",$_POST["id_producto"]);
    $id_producto = openssl_decrypt($formateado,CODE,KEY);
    $imagenes = $producto->obtener_imagenes($id_producto);

    // Retornar las imágenes en formato JSON
    echo json_encode($imagenes);
}

// Guardar las imágenes de un producto
if ($_POST['funcion'] == "guardar_imagenes") {
    // Asigna un arreglo vacío si no están definidos
    $ids      = isset($_POST['ids']) ? $_POST['ids'] : array();
    $estados  = isset($_POST['estados']) ? $_POST['estados'] : array();
    $tipos    = isset($_POST['tipos']) ? $_POST['tipos'] : array();
    $imagenes = isset($_FILES['imagenes']) ? $_FILES['imagenes'] : null;

    $formateado  = str_replace(" ", "+", $_POST["id_producto"]);
    $id_producto = openssl_decrypt($formateado, CODE, KEY);

    if ($id_producto === false) {
        echo "error_id_producto";
        exit;
    }

    // Arreglo para almacenar el nombre único de cada imagen nueva
    $nombres = array();
    $newFileIndex = 0; // Contador para archivos nuevos

    foreach ($ids as $key => $id_imagen) {
        // Usamos el campo "tipo" enviado desde el front-end
        if ($tipos[$key] == "nueva") {
            // Verificamos que se haya enviado un archivo
            if (
                isset($imagenes['tmp_name'][$newFileIndex]) &&
                !empty($imagenes['tmp_name'][$newFileIndex]) &&
                is_uploaded_file($imagenes['tmp_name'][$newFileIndex])
            ) {
                $tmp_name        = $imagenes['tmp_name'][$newFileIndex];
                $nombre_original = basename($imagenes['name'][$newFileIndex]);
                $nombre_unico    = uniqid() . "_" . $nombre_original;
                
                if (!move_uploaded_file($tmp_name, "../Util/Img/carrusel/" . $nombre_unico)) {
                    echo "error_subida_imagen";
                    exit;
                }
                $nombres[$key] = $nombre_unico;
            } else {
                echo "error_imagen2"; // No se adjuntó archivo para imagen nueva
                exit;
            }
            $newFileIndex++; // Incrementamos el contador para el siguiente archivo nuevo
        } else {
            // Para imágenes existentes solo se actualiza el estado
            $nombres[$key] = "";
        }
    }

    // Llamamos al método del modelo para gestionar las imágenes
    if (!$producto->gestionar_imagenes($id_producto, $ids, $estados, $nombres)) {
        echo "error_procesar_imagenes";
        exit;
    }

    echo "success";
}

// Eliminar una imagen
if ($_POST['funcion'] == "eliminar_imagen") {
    $id_imagen = $_POST['id_imagen'];
    if ($producto->eliminar_imagen($id_imagen)) {
        echo "success";
    } else {
        echo "error";
    }
}

// Eliminar un producto
if ($_POST["funcion"] == "eliminar_producto") {
    $id_producto = openssl_decrypt($_POST["id_producto"], CODE, KEY);
    if ($id_producto) {
        $producto->eliminar_producto($id_producto);
        echo json_encode(["mensaje" => "Producto inactivado correctamente"]);
    } else {
        echo json_encode(["error" => "No se pudo inactivar el producto"]);
    }
}









