<?php
header('Content-Type: application/json; charset=UTF-8');
include_once "../Util/Config/config.php";
include_once "../Models/Compra.php";
session_start();

$compra = new Compra();

if ($_POST["funcion"] === "buscar_compras_por_dni") {
    $dni    = trim($_POST["dni"] ?? "");
    $estado = (isset($_POST["estado"]) && $_POST["estado"] !== "")
                ? $_POST["estado"]
                : null;
    if ($dni === "") {
        // ------------- Sin DNI: traemos de todos los usuarios -------------
        $compras = $compra->obtener_compras_general_all($estado);
    } else {
        // ------------- Con DNI: buscamos el usuario y luego sus compras -------------
        $usuario = $compra->obtener_id_usuario_por_dni($dni);
        if (!$usuario) {
            echo json_encode([]);
            exit;
        }
        $compras = $compra->obtener_compras_general($usuario->id_usuario, $estado);
    }
    // Mapeo limpio a JSON
    $json = array_map(function($c) {
        return [
            'id_compra'    => $c->id_compra,
            'fecha_compra' => $c->fecha_compra,
            'total'        => $c->total,
            'estado'       => $c->estado,
            'dni_cliente'  => $c->dni_cliente ?? ''
        ];
    }, $compras);
    echo json_encode($json);
    exit;
}

if ($_POST["funcion"] === "obtener_detalle_compra") {
    $id_compra = intval($_POST["id"] ?? 0);
    $detalle   = $compra->obtener_detalle_compra($id_compra);
    echo json_encode($detalle);
    exit;
}