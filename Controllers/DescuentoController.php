<?php
// Se obtiene la hora local porque al querer ajustar la hora de 
// del descuento, se autoexpira por la diferencia horaria del servidor
// del programa y el servidor de php
date_default_timezone_set('America/Argentina/Cordoba');
header('Content-Type: application/json; charset=utf-8');
require_once '../Models/Descuento.php';
include_once "../Util/Config/config.php";

$desc = new Descuento();

if ($_POST['funcion'] === 'read_active_descuentos') {
    $now = date('Y-m-d H:i:s');
    $activos = $desc->read_all_descuentos($now, $now);
    echo json_encode($activos);
    exit;
}

if ($_POST['funcion'] === 'crear_descuento_producto') {
    $encIds  = $_POST['id_producto'] ?? [];
    $porc    = $_POST['porcentaje']   ?? null;
    $inicio  = $_POST['inicio']       ?? null;
    $fin     = $_POST['fin']          ?? null;

    if (empty($encIds) || !$porc || !$inicio || !$fin) {
        echo json_encode(['success'=>false, 'error'=>'Faltan datos']);
        exit;
    }

    try {
        $ids = [];
        foreach ($encIds as $enc) {
            $plain = openssl_decrypt($enc, CODE, KEY);
            if (ctype_digit($plain) && (int)$plain > 0) {
                $ids[] = (int)$plain;
            }
        }

        foreach ($ids as $id_prod) {
            $desc->crear_descuento([
                'id_producto' => $id_prod,
                'porcentaje'  => (float)$porc,
                'inicio'      => $inicio,
                'fin'         => $fin
            ]);
        }

        echo json_encode(['success'=>true]);
    } catch (Exception $e) {
        echo json_encode(['success'=>false, 'error'=>$e->getMessage()]);
    }
    exit;
}

if ($_POST['funcion'] === 'crear_descuento_categoria') {
    $catsRaw = $_POST['id_categoria'] ?? [];
    $porc    = $_POST['porcentaje']    ?? null;
    $inicio  = $_POST['inicio']        ?? null;
    $fin     = $_POST['fin']           ?? null;

    if (empty($catsRaw) || !$porc || !$inicio || !$fin) {
        echo json_encode(['success'=>false,'error'=>'Faltan datos']);
        exit;
    }

    $cats = array_filter(array_map('intval', $catsRaw), fn($v) => $v > 0);
    if (empty($cats)) {
        echo json_encode(['success'=>false,'error'=>'Categorías inválidas']);
        exit;
    }

    try {
        $productos = $desc->getProductosPorCategorias($cats);

        foreach ($productos as $p) {
            $desc->crear_descuento([
                'id_producto' => (int)$p['id_producto'],
                'porcentaje'  => (float)$porc,
                'inicio'      => $inicio,
                'fin'         => $fin
            ]);
        }

        echo json_encode(['success'=>true]);
    } catch (Exception $e) {
        echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
    }
    exit;
}

if ($_POST['funcion'] === 'eliminar_descuento') {
    $id = (int)($_POST['id_descuento'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['success'=>false,'error'=>'ID inválido']);
    } else {
        try {
            $desc->eliminar_descuento($id);
            echo json_encode(['success'=>true]);
        } catch(Exception $e) {
            echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
        }
    }
    exit;
}

if ($_POST['funcion'] === 'editar_descuento') {
    $id    = (int)($_POST['id_descuento'] ?? 0);
    $porc  = $_POST['porcentaje'] ?? null;
    $inicio= $_POST['inicio']     ?? null;
    $fin   = $_POST['fin']        ?? null;

    if ($id<=0 || !$porc || !$inicio || !$fin) {
        echo json_encode(['success'=>false,'error'=>'Faltan datos']);
    } else {
        try {
            $desc->editar_descuento($id, (float)$porc, $inicio, $fin);
            echo json_encode(['success'=>true]);
        } catch(Exception $e) {
            echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
        }
    }
    exit;
}

if ($_POST['funcion'] === 'descuento_terminado') {
    date_default_timezone_set('America/Argentina/Cordoba');
    $now = date('Y-m-d H:i:s');

    try {
        $migrated = $desc->descuento_terminado($now);
        echo json_encode([
            'success'  => true,
            'migrated' => $migrated,
            'message'  => "$migrated descuentos expirados movidos y borrados."
        ]);
    } catch (Exception $e) {
        echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
    }
    exit;
}





