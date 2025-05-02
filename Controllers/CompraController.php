<?php
include_once "../Util/Config/config.php";
include_once "../Models/Compra.php";
session_start();

$compra = new Compra();

// Flitrar registros de compras por DNI
if ($_POST["funcion"] == "buscar_compras_por_dni") {
    $dni = $_POST["dni"];

    // Paso 1: Buscar el ID del usuario por su DNI
    $usuario = $compra->obtener_id_usuario_por_dni($dni);
    if ($usuario) {
        // Paso 2: Obtener las compras generales de ese usuario
        $compras = $compra->obtener_compras_general($usuario->id_usuario);
        $json = [];
        foreach ($compras as $compra_item) {
            $json[] = array(
                // Si deseas mantener la encriptación, puedes hacerlo aquí
                "id_compra" => $compra_item->id_compra,
                "fecha_compra" => $compra_item->fecha_compra,
                "total" => $compra_item->total
            );
        }
        echo json_encode($json);
    } else {
        echo json_encode([]);
    }
}

// Obtener detalle de compra
if ($_POST["funcion"] == "obtener_detalle_compra") {
    $id_compra = $_POST["id"];

    $detalle = $compra->obtener_detalle_compra($id_compra);
    echo json_encode($detalle);
}

