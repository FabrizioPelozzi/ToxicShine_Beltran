<?php
// finalizar_compra.php
session_start();

if (
    empty($_GET['collection_status']) 
    || $_GET['collection_status'] !== 'approved'
    || empty($_GET['preference_id'])
    || !isset($_SESSION['mp_preference_id'])
    || $_GET['preference_id'] !== $_SESSION['mp_preference_id']
) {
    // No autorizo acceso directo ni pagos fallidos
    header("Location: ../views/carrito.php?error=Acceso no autorizado");
    exit();
}

// 2) Verifico con la SDK que ese pago efectivamente exista y esté aprobado
require_once '../vendor/autoload.php';
use MercadoPago\SDK;
use MercadoPago\Payment;

SDK::setAccessToken("APP_USR-710228867361653-041316-f07bddbb3241a83d28817b7b6cd86c04-2386000613");

$payment = Payment::find_by_id($_GET['collection_id']);
if (!$payment || $payment->status !== 'approved') {
    header("Location: ../views/carrito.php?error=Pago no aprobado");
    exit();
}

header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit();
}

include_once "../Util/Config/config.php"; // Configuración
include_once "../Models/Conexion.php";     // Archivo que define la clase Conexion

// Instancia la conexión y obtiene el objeto PDO
$conexion = new Conexion();
$pdo = $conexion->pdo;

try {
    // Comienza la transacción
    $pdo->beginTransaction();
    
    $id_usuario = $_SESSION['id_usuario'];

    // 1. Recuperar los productos del carrito y recalcular el total
    $sqlCarrito = "SELECT 
                        cp.cantidad, 
                        p.precio_venta
                   FROM carrito_producto cp
                   INNER JOIN carrito c ON cp.id_carrito = c.id_carrito
                   INNER JOIN producto p ON cp.id_producto = p.id_producto
                   WHERE c.id_usuario = :id_usuario
                   AND p.estado = 'A'";
    $stmtCarrito = $pdo->prepare($sqlCarrito);
    $stmtCarrito->execute([":id_usuario" => $id_usuario]);
    $productos = $stmtCarrito->fetchAll(PDO::FETCH_ASSOC);
    
    if (!$productos) {
        throw new Exception("El carrito está vacío");
    }
    
    $total = 0;
    foreach ($productos as $producto) {
        $total += $producto['cantidad'] * $producto['precio_venta'];
    }

    if ($total <= 0) {
        throw new Exception("Total inválido");
    }
    
    // 2. Insertar la compra en la tabla 'compra'
    $sqlCompra = "INSERT INTO compra (id_usuario, fecha_compra, total) VALUES (:id_usuario, NOW(), :total)";
    $stmtCompra = $pdo->prepare($sqlCompra);
    $stmtCompra->execute([
        ":id_usuario" => $id_usuario,
        ":total"      => $total
    ]);
    $id_compra = $pdo->lastInsertId();
    
    // 3. Recuperar nuevamente los productos con más datos para procesar compra_producto y actualización de stock
    $sqlDetalleCarrito = "SELECT 
                        cp.id_producto, 
                        cp.cantidad, 
                        p.precio_venta, 
                        p.stock
                   FROM carrito_producto cp
                   INNER JOIN carrito c ON cp.id_carrito = c.id_carrito
                   INNER JOIN producto p ON cp.id_producto = p.id_producto
                   WHERE c.id_usuario = :id_usuario
                   AND p.estado = 'A'";
    $stmtDetalle = $pdo->prepare($sqlDetalleCarrito);
    $stmtDetalle->execute([":id_usuario" => $id_usuario]);
    $detalles = $stmtDetalle->fetchAll(PDO::FETCH_ASSOC);
    
    if (!$detalles) {
        throw new Exception("El carrito está vacío (detalle)");
    }
    
    // 4. Por cada producto, registrar en 'compra_producto' y restar el stock
    foreach ($detalles as $detalle) {
        $id_producto  = $detalle['id_producto'];
        $cantidad     = $detalle['cantidad'];
        $precio       = $detalle['precio_venta'];
        $stock_actual = $detalle['stock'];
        
        if ($stock_actual < $cantidad) {
            throw new Exception("El producto (ID: $id_producto) no cuenta con stock suficiente");
        }
        
        // Insertar registro en compra_producto
        $sqlCompraProd = "INSERT INTO compra_producto (id_compra, id_producto, cantidad, precio) 
                          VALUES (:id_compra, :id_producto, :cantidad, :precio)";
        $stmtCompraProd = $pdo->prepare($sqlCompraProd);
        $stmtCompraProd->execute([
            ":id_compra"   => $id_compra,
            ":id_producto" => $id_producto,
            ":cantidad"    => $cantidad,
            ":precio"      => $precio
        ]);
        
        // Actualizar stock del producto
        $nuevo_stock = $stock_actual - $cantidad;
        $sqlActualizarStock = "UPDATE producto SET stock = :nuevo_stock WHERE id_producto = :id_producto";
        $stmtActualizarStock = $pdo->prepare($sqlActualizarStock);
        $stmtActualizarStock->execute([
            ":nuevo_stock" => $nuevo_stock,
            ":id_producto" => $id_producto
        ]);
    }
    
    // 5. (Opcional) Eliminar los productos del carrito
    $sqlEliminarCarrito = "DELETE cp 
                           FROM carrito_producto cp
                           INNER JOIN carrito c ON cp.id_carrito = c.id_carrito
                           WHERE c.id_usuario = :id_usuario";
    $stmtEliminarCarrito = $pdo->prepare($sqlEliminarCarrito);
    $stmtEliminarCarrito->execute([":id_usuario" => $id_usuario]);
    
    // Confirmar la transacción
    $pdo->commit();

    // → Redirigir al carrito.php al finalizar
    header("Location: ../views/carrito.php?success=1&id_compra={$id_compra}");
    exit();

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // → Redirigir con mensaje de error
    $msg = urlencode($e->getMessage());
    header("Location: ../views/carrito.php?error={$msg}");
    exit();
}

