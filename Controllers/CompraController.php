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
        $compras = $compra->obtener_compras_general_all($estado);
    } else {
        $usuario = $compra->obtener_id_usuario_por_dni($dni);
        if (!$usuario) {
            echo json_encode([]);
            exit;
        }
        $compras = $compra->obtener_compras_general($usuario->id_usuario, $estado);
    }

    $json = [];
    foreach ($compras as $c) {
        // Obtener el detalle de productos
        $detalle = $compra->obtener_detalle_compra($c->id_compra);
        $prods = [];
        foreach ($detalle as $p) {
            $prods[] = [
                'nombre_producto' => $p->nombre_producto,
                'cantidad'        => $p->cantidad,
                'precio_venta'    => $p->precio_venta
            ];
        }

        $json[] = [
            'id_compra'    => $c->id_compra,
            'fecha_compra' => $c->fecha_compra,
            'total'        => $c->total,
            'estado'       => $c->estado,
            'dni_cliente'  => $c->dni_cliente ?? '',
            'productos'    => $prods
        ];
    }

    echo json_encode($json);
    exit;
}

if ($_POST["funcion"] === "obtener_detalle_compra") {
    $id_compra = intval($_POST["id"] ?? 0);
    $detalle   = $compra->obtener_detalle_compra($id_compra);
    echo json_encode($detalle);
    exit;
}