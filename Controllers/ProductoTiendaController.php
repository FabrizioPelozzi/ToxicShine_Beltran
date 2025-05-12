<?php
header('Content-Type: application/json; charset=UTF-8');

include_once __DIR__ . '/../Models/ProductoTienda.php';
include_once __DIR__ . '/../Util/Config/config.php';
include_once __DIR__ . '/../Models/Favorito.php';
session_start();



$producto = new Producto();
$favorito = new Favorito();
$response = [];

if (isset($_POST['funcion'])) {
    switch ($_POST['funcion']) {
        case 'llenar_productos':
            // Recoger parámetros
            $nombre    = $_POST['nombre']     ?? '';
            $categoria = $_POST['categoria']  ?? '';
            $stock     = $_POST['stock']      ?? '';
            $precioMin = $_POST['precio_min'] ?? '';
            $precioMax = $_POST['precio_max'] ?? '';

            // Lógica de filtrado
            if ($nombre === '' && $categoria === '' && $stock === '' && $precioMin === '' && $precioMax === '') {
                $producto->llenar_productos();
            } else {
                $producto->filtrar_productos(
                    $categoria,
                    $precioMin,
                    $precioMax,
                    $stock,
                    $nombre
                );
            }

            // Construir salida JSON
            foreach ($producto->objetos as $obj) {
                $response[] = [
                    'id'          => openssl_encrypt($obj->id, CODE, KEY),
                    'producto'    => $obj->producto,
                    'imagen'      => $obj->imagen,
                    'descripcion' => property_exists($obj, 'descripcion') ? $obj->descripcion : '',
                    'precio'      => $obj->precio,
                    'categoria'   => $obj->categoria,
                    'stock'       => $obj->stock,
                ];
            }
            break;

        case 'verificar_producto':
            if (!empty($_SESSION['product-verification'])) {
                $formateado  = str_replace(' ', '+', $_SESSION['product-verification']);
                $id_producto = openssl_decrypt($formateado, CODE, KEY);

                if (is_numeric($id_producto)) {
                    $producto->llenar_productos($id_producto);
                    if (!empty($producto->objetos)) {
                        $p = $producto->objetos[0];
                        $producto->capturar_imagenes($p->id);
                        $imagenes = [];
                        foreach ($producto->objetos as $img) {
                            $imagenes[] = ['id' => $img->id, 'nombre' => $img->nombre];
                        }
                        $usuario_sesion = $_SESSION['id_usuario'] ?? '';
                        $response = [
                            'id'             => $p->id,
                            'producto'       => $p->producto,
                            'imagen'         => $p->imagen,
                            'descripcion'    => $p->descripcion,
                            'precio'         => $p->precio,
                            'categoria'      => $p->categoria,
                            'stock'          => $p->stock,
                            'imagenes'       => $imagenes,
                            'usuario_sesion' => $usuario_sesion,
                        ];
                    } else {
                        $response = ['error' => 'Producto no encontrado'];
                    }
                } else {
                    $response = ['error' => 'ID inválido'];
                }
            } else {
                $response = ['error' => 'Sin verification en sesión'];
            }
            break;

        default:
            $response = ['error' => 'Función no definida'];
    }
}

echo json_encode($response);
exit;
?>
