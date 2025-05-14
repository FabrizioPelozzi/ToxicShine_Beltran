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
        $_SESSION["id_usuario"]      = $objeto['id_usuario'];
        $_SESSION["email"]           = $objeto['email'];
        $_SESSION["contrasena"]      = $objeto['contrasena'];
        $_SESSION["id_tipo_usuario"] = $objeto['id_tipo_usuario'];
        $_SESSION["nombre"]          = $objeto['nombre'];
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

// Trae datos de usuario
if ($_POST['funcion'] === 'leer_usuarios') {
    // recibir filtro DNI (puede venir vacío)
    $dni = trim($_POST['dni'] ?? '');
    $usuarios = $usuario->obtener_usuarios($dni);

    // Mapear a JSON limpio (sin exponer la contraseña en claro)
    $json = array_map(function($u){
        return [
            'id_usuario'   => $u->id_usuario,
            'email'        => $u->email,
            'dni'          => $u->dni,
            'nombre'       => $u->nombre,
            'apellido'     => $u->apellido,
            'telefono'     => $u->telefono,
            'tipo_usuario' => $u->tipo_usuario
        ];
    }, $usuarios);

    echo json_encode($json);
    exit;
}

// Editar usuario
if ($_POST['funcion'] === 'editar_usuario_admin') {
    $id    = intval($_POST['id_usuario_mod']);
    $email = $_POST['email_mod'];
    $dni   = $_POST['dni_mod'];
    // actualizamos solo email y dni
    $sql = "UPDATE usuario
            SET email = :email,
                dni   = :dni
            WHERE id_usuario = :id";
    $stmt = $usuario->acceso->prepare($sql);
    echo $stmt->execute([
        ':email'=>$email,
        ':dni'=>$dni,
        ':id'  =>$id
    ]) ? 'success' : 'error';
    exit;
}

// Restablecer contraseña
if ($_POST['funcion'] === 'reset_password') {
    $id = intval($_POST['id_usuario']);
    $nueva = $_POST['nueva_password'];       // en texto claro recibido
    $hash  = password_hash($nueva, PASSWORD_DEFAULT);
    $usuario->cambiar_password_por_id($id, $hash);
    echo json_encode(['status' => 'success']);
    exit;
}

