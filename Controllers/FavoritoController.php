<?php
include_once "../Models/ProductoTienda.php";
include_once "../Util/Config/config.php";
include_once "../Models/Favorito.php";
$producto = new Producto();
$favorito = new Favorito();
session_start();

// Cambiar estado de favorito
if ($_POST["funcion"]=="cambiar_estado_favorito") {
    $id_favorito_encrypted = $_POST["id_favorito"];
    $formateado = str_replace(" ","+",$id_favorito_encrypted);
    $id_favorito = openssl_decrypt($formateado,CODE,KEY);
    $formateado = str_replace(" ","+",$_SESSION["product-verification"]);
    $id_producto = openssl_decrypt($formateado,CODE,KEY);
    $estado_favorito = $_POST["estado_favorito"];
    $id_usuario = $_SESSION["id_usuario"];
    $mensaje="";
    if ($id_favorito_encrypted!="") {
        if (is_numeric($id_favorito)) {
            if (is_numeric($id_producto)) {
                $producto ->llenar_productos($id_producto);
                $titulo = $producto ->objetos[0]->producto;
                $url = "Views/descripcion.php?name=".$titulo."&&id=".$formateado;
                $favorito->leer_favorito_usuario_producto($id_usuario,$id_producto);
                $estado_favorito = $favorito -> objetos[0] -> estado;
                if ($estado_favorito=="A") {
                    $favorito->update_remove($id_favorito);
                    $mensaje = "remove";
                }else {
                    $favorito->update_add($id_usuario,$id_producto,$id_favorito,$url);
                    $mensaje = "add";
                }
            }else {
                $mensaje ="error al eliminar";
            }
        }else {
            $mensaje ="error al eliminar";
        }
    } else {
        if (is_numeric($id_producto)) {
            $favorito->leer_favorito_usuario_producto($id_usuario,$id_producto);
            $id_favorito="";
            $estado_favorito="";
            if (count($favorito->objetos)>0) {
                $id_favorito = $favorito -> objetos[0] -> id;
                $estado_favorito = $favorito -> objetos[0] -> estado;
            }
            $producto ->llenar_productos($id_producto);
            $titulo = $producto ->objetos[0]->producto;
            $url = "Views/descripcion.php?name=".$titulo."&&id=".$formateado;
            if ($estado_favorito=="A") {
                $favorito->update_remove($id_favorito);
                $mensaje = "remove";
            }else {
                $favorito->update_add($id_usuario,$id_producto,$id_favorito,$url);
                $mensaje = "add";
            }
        }else {
            $mensaje ="error al eliminar";
        }
    }
    $json=array(
        "mensaje"=>$mensaje
    );
    $jsonstring=json_encode($json);
    echo $jsonstring;
}

// Leer favoritos
if ($_POST["funcion"]=="read_favoritos") {
    if (!empty($_SESSION["id_usuario"])) {
        $id_usuario=$_SESSION["id_usuario"];
        $favorito->read($id_usuario);
        $json = array();
        foreach ($favorito->objetos as $objeto) {
            $json[]=array(
                "id"=>openssl_encrypt($objeto->id,CODE,KEY),
                "titulo"=>$objeto->titulo,
                "precio"=>$objeto->precio,
                "imagen"=>$objeto->imagen,
                "url"=>$objeto->url,
            );    
        }
        $jsonstring = json_encode($json);
        echo $jsonstring;
    } else {
        echo "el usuario no esta en sesion";
    }
    
}

// Leer todos los favoritos
if ($_POST["funcion"]=="read_all_favoritos") {
    if (!empty($_SESSION["id_usuario"])) {
        $id_usuario = $_SESSION["id_usuario"];
        $favorito->read_all_favoritos($id_usuario);
        $json = array();
        foreach ($favorito->objetos as $objeto) {
            $json[] = array(
                "id" => openssl_encrypt($objeto->id, CODE, KEY),
                "titulo" => $objeto->titulo,
                "precio" => $objeto->precio,
                "imagen" => $objeto->imagen,
                "url" => $objeto->url,
                "descripcion" => $objeto->descripcion,
                "categoria" => $objeto->categoria
            );
        }
        echo json_encode($json);
    } else {
        echo "el usuario no esta en sesion";
    }
}

// Eliminar favorito
if ($_POST["funcion"] == "eliminar_favorito") {
    if (!empty($_SESSION["id_usuario"])) {
        $id_usuario = $_SESSION["id_usuario"];
        $id_favorito_encrypted = $_POST["id_favorito"];
        $formateado = str_replace(" ", "+", $id_favorito_encrypted);
        $id_favorito = openssl_decrypt($formateado, CODE, KEY);
        if (isset($_SESSION["product-verification"])) {
            $formateado = str_replace(" ", "+", $_SESSION["product-verification"]);
            $id_producto = openssl_decrypt($formateado, CODE, KEY);
        } else {
            $id_producto = null;
        }
        $mensaje = "";

        if (is_numeric($id_favorito)) {
            $favorito->update_remove($id_favorito);

            // Obtener información del producto
            $producto->llenar_productos($id_producto);

            // Verificar si el producto existe en la respuesta
            if (!empty($producto->objetos) && property_exists($producto->objetos[0], 'nombre_producto')) {
                $titulo = $producto->objetos[0]->nombre_producto;
                $descripcion = "Se removió de favoritos el producto " . $titulo;
            } else {
                $descripcion = "Se removió un producto de favoritos, pero no se pudo obtener el nombre.";
            }

            $mensaje = "favorito eliminado";
        } else {
            $mensaje = "error al eliminar";
        }

        $json = array("mensaje" => $mensaje);
        echo json_encode($json);
    } else {
        echo "el usuario no está en sesión";
    }
}

// Mostrar titulo favorito
if ($_POST["funcion"]=="mostrar_titulo_favorito") {
    if (!empty($_SESSION["id_usuario"])) {
        $id_usuario=$_SESSION["id_usuario"];
        $formateado = str_replace(" ","+",$_SESSION["product-verification"]);
        $id_producto = openssl_decrypt($formateado,CODE,KEY);
        $producto -> llenar_productos($id_producto);
        $nombre_producto = $producto -> objetos[0]->producto;
        $favorito->leer_favorito_usuario_producto($id_usuario,$id_producto);
        $id_favorito="";
        $estado_favorito="";
        if (count($favorito->objetos)>0) {
            $id_favorito = openssl_encrypt($favorito -> objetos[0] -> id,CODE,KEY);
            $estado_favorito = $favorito -> objetos[0] -> estado;
        } 
        $json=array(
            "usuario_sesion"=>$id_usuario,
            "estado_favorito"=>$estado_favorito,
            "producto"=>$nombre_producto,
            "id_favorito"=>$id_favorito,
        );
        $jsonstring = json_encode($json);
        echo $jsonstring;
    } else {
        $id_usuario="";
        $formateado = str_replace(" ","+",$_SESSION["product-verification"]);
        $id_producto = openssl_decrypt($formateado,CODE,KEY);
        $producto -> llenar_productos($id_producto);
        $nombre_producto = $producto -> objetos[0]->producto;
        $json=array(
            "usuario_sesion"=>$id_usuario,
            "producto"=>$nombre_producto,
        );
        $jsonstring = json_encode($json);
        echo $jsonstring;
    }
    
}