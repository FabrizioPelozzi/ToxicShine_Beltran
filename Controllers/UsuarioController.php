<?php
include_once "../Models/Usuario.php";
$usuario = new Usuario();
session_start();

// Login
if ($_POST["funcion"] == "login") {
    $user = $_POST["user"];
    $pass = $_POST["pass"];
    $usuario->loguearse($user, $pass);
    if ($usuario->objetos != null) {
        foreach ($usuario->objetos as $objeto) {
            $_SESSION["id_usuario"] = $objeto->id_usuario;
            $_SESSION["email"] = $objeto->email;
            $_SESSION["contrasena"] = $objeto->contrasena;
            $_SESSION["id_tipo_usuario"] = $objeto->id_tipo_usuario;
            $_SESSION["nombre"] = $objeto->nombre;
        }
        echo "logueado";
    } 
}

// Verificar sesión
if ($_POST["funcion"] == "verificar_sesion") {
    if (!empty($_SESSION["id_usuario"])) {
        $json[] = array(
            "id_usuario" => $_SESSION["id_usuario"],
            "email" => $_SESSION["email"],
            "contrasena" => $_SESSION["contrasena"],
            "id_tipo_usuario" => $_SESSION["id_tipo_usuario"],
            "nombre" => $_SESSION["nombre"]
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    } else {
        echo "";
    }
}

// Verificar email
if ($_POST["funcion"] == "verificar_email") {
    $email = $_POST["value"];
    $usuario->verificar_email($email);
    if ($usuario->objetos != null) {
        echo "success";    
    }
}

// Verificar DNI
if ($_POST["funcion"] == "verificar_dni") {
    $dni = $_POST["value"];
    $usuario->verificar_dni($dni);
    // Si el array objetos trae algo, es que ya existe ese DNI
    if ($usuario->objetos != null) {
        echo "success";
    }
    // Si no devuelve nada, el DNI es libre
}

// Registrar usuario
if ($_POST["funcion"] == "registrar_usuario") {
    $email = $_POST["email"];
    $pass = $_POST["pass"];
    $nombres = $_POST["nombres"];
    $apellidos = $_POST["apellidos"];
    $dni = $_POST["dni"];
    $telefono = $_POST["telefono"];
    $estado = $_POST["estado"] ?? "activo";
    $usuario->registrar_usuario($email, $pass, $nombres, $apellidos, $dni, $telefono, $estado);
    echo "success";
}

// Obtener datos
if($_POST['funcion'] == "obtener_datos") {
    $usuario -> obtener_datos($_SESSION['id_usuario']);
    foreach ($usuario->objetos as $objeto) {
        $json[] = array(
            "email" => $objeto->email,
            "nombre" => $objeto->nombre,
            "apellido" => $objeto->apellido,
            "dni" => $objeto->dni,
            "telefono" => $objeto->telefono,
            "tipo_usuario" => $objeto->tipo_usuario,
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}

// Editar datos
if ($_POST["funcion"] == "editar_datos") {
    $id_usuario = $_SESSION["id_usuario"];
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $telefono = $_POST["telefono"];
    $usuario->editar_datos($id_usuario, $nombre, $apellido, $telefono);
    echo "success";
}
