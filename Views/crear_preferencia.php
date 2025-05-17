<?php
// ————— Control de errores al cliente —————
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/mp_errors.log');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ob_start();

header('Content-Type: application/json');
session_start();

require_once '../vendor/autoload.php';
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

// Token sandbox o producción según corresponda
SDK::setAccessToken("APP_USR-710228867361653-041316-f07bddbb3241a83d28817b7b6cd86c04-2386000613"); 


// Recibir y validar total
$total = isset($_POST['total']) ? floatval($_POST['total']) : 0;
if ($total <= 0) {
    echo json_encode(["error" => "Total inválido"]);
    exit();
}

// Crear preferencia
$preference = new Preference();
$item = new Item();
$item->title = "Compra Total";
$item->quantity = 1;
$item->unit_price = $total;
$preference->items = [$item];
// Ajusta back_urls si necesitas
$preference->back_urls = [
    "success" => "http://localhost/commerce/views/finalizar_compra.php",  // aquí se procesará la compra
    "failure" => "http://localhost/commerce/views/carrito.php",
];
$preference->auto_return = "approved";

// Guarda
$preference->save();

// **Depura el error completo que devuelve el SDK**:
$errorInfo = [];
if (isset($preference->error)) {
    $errorInfo[] = $preference->error;
}
if (!empty($preference->errors)) {
    $errorInfo = array_merge($errorInfo, (array)$preference->errors);
}

ob_end_clean();

// Si no hay ID, devolvemos el detalle
if (!$preference->id) {
    echo json_encode([
        "error"      => "No se pudo crear la preferencia",
        "mp_errors"  => $errorInfo
    ]);
    exit();
}

// Éxito
$_SESSION['mp_preference_id'] = $preference->id;
echo json_encode([
    "preference_id" => $preference->id,
    "init_point"    => $preference->init_point
]);
