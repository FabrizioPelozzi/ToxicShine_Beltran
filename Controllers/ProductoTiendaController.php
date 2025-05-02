<?php
include_once "../Models/ProductoTienda.php";
include_once "../Util/Config/config.php";
include_once "../Models/Favorito.php";
$producto = new Producto();
$favorito = new Favorito();
session_start();

// Leer todos los productos
if ($_POST["funcion"] == "llenar_productos") {
    $nombre = $_POST['nombre'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $stock = $_POST['stock'] ?? '';
    $precio_max = $_POST['precio_max'] ?? '';

    // Lógica para decidir si es filtrado o completo
    if ($nombre === '' && $categoria === '' && $stock === '' && $precio_max === '') {
        $producto->llenar_productos();
    } else {
        $producto->filtrar_productos($categoria, '', $precio_max, $stock, $nombre);
    }

    $json = array();
    foreach ($producto->objetos as $objeto) {
        $json[] = array(
            "id" => openssl_encrypt($objeto->id, CODE, KEY),
            "producto" => $objeto->producto,
            "imagen" => $objeto->imagen,
            "descripcion" => $objeto->descripcion,
            "precio" => $objeto->precio,
            "categoria" => $objeto->categoria,
            "stock" => $objeto->stock 
        );
        
    }
    echo json_encode($json);
}

// Verificar si el producto existe
if ($_POST["funcion"] == "verificar_producto") {
    $formateado = str_replace(" ","+",$_SESSION["product-verification"]);
    $id_producto = openssl_decrypt($formateado,CODE,KEY);
    if (is_numeric($id_producto)) {
        $producto->llenar_productos($id_producto);
        $id = $producto->objetos[0]->id;
        $nombre_producto = $producto->objetos[0]->producto;
        $descripcion = $producto->objetos[0]->descripcion;
        $imagen = $producto->objetos[0]->imagen;
        $precio = $producto->objetos[0]->precio;
        $categoria = $producto->objetos[0]->categoria;
        $stock = $producto->objetos[0]->stock;
        $producto->capturar_imagenes($id);
        $imagenes = array();
        foreach ($producto->objetos as $objeto) {
            $imagenes[]=array(
                "id"=>$objeto->id,
                "nombre"=>$objeto->nombre,
            );
        }
        $id_usuario_sesion=0;
        $usuario_sesion="";
        if (!empty($_SESSION["id_usuario"])) {
            $id_usuario_sesion=1;
            $usuario_sesion=$_SESSION["id_usuario"];
        }
            
        $json = array(
            "id" => $id,
            "producto" => $nombre_producto,
            "imagen" => $imagen,
            "descripcion" => $descripcion,
            "precio" => $precio,
            "categoria" => $categoria,
            "stock" => $stock,
            "imagenes" => $imagenes,
            "usuario_sesion"=>$usuario_sesion,
        );
        $jsonstring = json_encode($json);
        echo $jsonstring;
    } else {
        echo "error";
    }
}

// Filtrar productos
if ($_POST["funcion"] == "filtrar_productos") {
    $categoria = $_POST["categoria"] ?? "";
    $min_precio = $_POST["min_precio"] ?? "";
    $max_precio = $_POST["max_precio"] ?? "";
    $stock = $_POST["stock"] ?? "";
    $nombre = $_POST["nombre"] ?? "";

    $producto->filtrar_productos($categoria, $min_precio, $max_precio, $stock, $nombre);

    $json = array();
    foreach ($producto->objetos as $objeto) {
        $json[] = array(
            "id" => openssl_encrypt($objeto->id, CODE, KEY),
            "producto" => $objeto->producto,
            "imagen" => $objeto->imagen,
            "precio" => $objeto->precio,
            "categoria" => $objeto->categoria,
            "stock" => $objeto->stock
        );
    }
    echo json_encode($json);
}

