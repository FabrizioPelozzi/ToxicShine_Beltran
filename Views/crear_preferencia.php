<?php
// Asegurarse de que no haya salida antes de este encabezado
header('Content-Type: application/json');
session_start();

// Requiere autoload para usar Mercado Pago SDK
require_once '../vendor/autoload.php';  // Ajusta la ruta si es necesario

use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

// Configura el Access Token (prueba o producción)
SDK::setAccessToken("APP_USR-710228867361653-041316-f07bddbb3241a83d28817b7b6cd86c04-2386000613"); // Cambia por el de producción si es necesario

// Recibir el total desde POST
$total = isset($_POST['total']) ? floatval($_POST['total']) : 0;

// Validar que el total sea mayor a 0
if ($total <= 0) {
    echo json_encode(["error" => "Total inválido"]);
    exit();
}

// Crear la preferencia de pago
$preference = new Preference();

$item = new Item();
$item->title = "Compra Total";
$item->quantity = 1;
$item->unit_price = $total;

// Asignar ítems a la preferencia
$preference->items = [$item];
$preference->external_reference = uniqid('cart_'); 

// URLs de redirección de Mercado Pago

$preference->back_urls = [
    "success" => "http://localhost/commerce/views/finalizar_compra.php",  // aquí se procesará la compra
    "failure" => "http://localhost/commerce/views/carrito.php",
];
$preference->auto_return = "approved";


// Guardar la preferencia
$preference->save();

$_SESSION['mp_preference_id'] = $preference->id;

// Validar si se creó correctamente
if (!$preference->id) {
    echo json_encode(["error" => "No se pudo crear la preferencia"]);
    exit();
}

// Enviar el ID y el punto de inicio de pago (init_point) al cliente
echo json_encode([
    "preference_id" => $preference->id,
    "init_point" => $preference->init_point  // Esta URL es la que redirige al pago de Mercado Pago
]);