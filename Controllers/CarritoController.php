<?php
ob_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once "../Util/Config/config.php";
include_once "../Models/Carrito.php";
session_start();

$carrito = new Carrito();

if ($_POST["funcion"] == "agregar_al_carrito") {
    if (!isset($_SESSION["id_usuario"])) {
        echo json_encode(["error" => "error_sesion"]);
        exit();
    }

    $id_usuario   = $_SESSION["id_usuario"];
    $id_producto  = intval($_POST["id_producto"]);
    $cantidad     = intval($_POST["cantidad"]);

    // 1) ¿Cuánto hay ya en el carrito?
    $cantidad_actual = $carrito->obtener_cantidad_por_producto($id_producto);

    // 2) ¿Cuál es el stock real del producto?
    $stock = $carrito->obtener_stock($id_producto);

    // 3) Si al sumar sobrepasa el stock, devuelvo max_stock
    if ($cantidad_actual + $cantidad > $stock) {
        $restante = $stock - $cantidad_actual;
        echo json_encode([
            "mensaje"        => "max_stock",
            "max_disponible" => $restante
        ]);
        exit();
    }

    // 4) Si cabe, procedo a agregar
    $resultado = $carrito->agregarProducto($id_usuario, $id_producto, $cantidad);

    if ($resultado) {
        echo json_encode(["mensaje" => "success"]);
    } else {
        echo json_encode(["mensaje" => "error"]);
    }
    exit();
}

if ($_POST["funcion"] == "leer_carrito") {
    if (!empty($_SESSION["id_usuario"])) {
        $id_usuario = $_SESSION["id_usuario"];
        $carrito->leer($id_usuario); 
        $json = array();
        if (!empty($carrito->objetos)) {
            foreach ($carrito->objetos as $objeto) {
                // Encriptamos el ID del producto
                $id_producto_encriptado = openssl_encrypt($objeto->id_producto, CODE, KEY);
                $id_producto_encriptado = str_replace("+", " ", $id_producto_encriptado); // Evita problemas en la URL
                
                $json[] = array(
                    "id"           => $objeto->id,
                    "titulo"       => $objeto->titulo,
                    "cantidad"     => $objeto->cantidad,
                    "precio"       => $objeto->precio,
                    "imagen"       => $objeto->imagen,
                    "descripcion"  => $objeto->descripcion,
                    "id_producto"  => $id_producto_encriptado, // Usamos el ID encriptado
                    "id_categoria" => $objeto->id_categoria,
                    "categoria"    => $objeto->categoria,  
                    "stock"        => $objeto->stock,
                    "id_carrito"   => $objeto->id_carrito
                );
            }
        }
        ob_end_clean();
        echo json_encode($json);
        exit();
    } else {
        ob_end_clean();
        echo json_encode([]);
        exit();
    }
}

if ($_POST['funcion'] == 'actualizar_cantidad') {
    $id = $_POST['id'];  // id del registro en carrito_producto
    $cantidad = $_POST['cantidad'];
    $carrito->actualizar_cantidad($id, $cantidad);
    echo 'actualizado';
    exit();
}

if ($_POST['funcion'] === 'consultar_cantidad') {
    $id_producto = intval($_POST['id_producto']);
    // Asume que $carrito es la instancia de tu modelo Carrito
    $cantidad = $carrito->obtener_cantidad_por_producto($id_producto);
    // Devolvemos JSON: { cantidad_actual: X }
    echo json_encode(['cantidad_actual' => $cantidad]);
    exit;
}

if ($_POST['funcion'] == 'eliminar_producto') {
    $id = $_POST['id']; // id del carrito_producto
    $id_usuario = $_SESSION["id_usuario"];
    $carrito->eliminar($id, $id_usuario);
    echo 'producto eliminado';
    exit();
}




