<?php
include_once "Conexion.php";
class Usuario {
    var $objetos;

    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    // Funcion para loguearse
    public function loguearse(string $email, string $pass) {
        $sql = "SELECT * FROM usuario WHERE email = :email";
        $query = $this->acceso->prepare($sql);
        $query->execute([':email' => $email]);
        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($pass, $usuario['contrasena'])) {
            // El hash coincide
            $this->objetos = [$usuario];
            return $this->objetos;
        }

        return null;
    }

    // Funcion para verificar el email
    function verificar_email($user) {
        $sql = "SELECT * FROM usuario WHERE email = :user";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(":user" => $user));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    // Funcion para verificar el dni
    function verificar_dni($dni) {
        $sql = "SELECT * FROM usuario WHERE dni = :dni";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(":dni" => $dni));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    // Funcion para registrar un usuario
    public function registrar_usuario(
        string $email,
        string $pass,
        string $nombres,
        string $apellidos,
        string $dni,
        string $telefono
        ) {
        try {
            $this->acceso->beginTransaction();

            // Obtener id_tipo_usuario de cliente
            $sql_tipo = "SELECT id_tipo_usuario FROM tipo_usuario WHERE tipo_usuario = 'cliente'";
            $id_tipo = $this->acceso->query($sql_tipo)->fetchColumn();

            // Hashear la contraseña
            $hash_pass = password_hash($pass, PASSWORD_DEFAULT);

            // Insertar nuevo usuario
            $sql = "INSERT INTO usuario
                (email, contrasena, dni, nombre, apellido, telefono, id_tipo_usuario, estado)
             VALUES
                (:email, :pass, :dni, :nombre, :apellido, :telefono, :id_tipo, 'A')";
            $stmt = $this->acceso->prepare($sql);
            $stmt->execute([
                ':email'   => $email,
                ':pass'    => $hash_pass,
                ':dni'     => $dni,
                ':nombre'  => $nombres,
                ':apellido'=> $apellidos,
                ':telefono'=> $telefono,
                ':id_tipo' => $id_tipo
            ]);

            $this->acceso->commit();
            return true;
        } catch (Exception $e) {
            $this->acceso->rollBack();
            error_log("Error en registro de usuario: " . $e->getMessage());
            return false;
        }
    }

    // Funcion para obtener los datos de un usuario
    function obtener_datos($user) {
        $sql = "SELECT *
            FROM usuario
            JOIN tipo_usuario ON usuario.id_tipo_usuario = tipo_usuario.id_tipo_usuario
            WHERE usuario.id_usuario = :user";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(":user" => $user));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    
    // Funcion para editar los datos de un usuario
    function editar_datos($id_usuario, $nombre, $apellido, $telefono) {
        $sql ="UPDATE usuario
                SET nombre=:nombre,
                apellido=:apellido,
                telefono=:telefono
                WHERE id_usuario=:id_usuario";
        $query = $this-> acceso-> prepare($sql);
        $variables = array(
            ":id_usuario"=>$id_usuario,
            ":nombre"=>$nombre,
            ":apellido"=>$apellido,
            ":telefono"=>$telefono
        );
        $query->execute($variables);
    }

    public function cambiar_password(string $email, string $nueva_pass): bool {
    $sql = "UPDATE usuario SET contrasena = :pass WHERE email = :email";
    $stmt = $this->acceso->prepare($sql);

    try {
        $stmt->execute([
            ':pass'  => $nueva_pass, // ya viene hasheada
            ':email' => $email
        ]);
        return true;
    } catch (PDOException $e) {
        error_log("Error al cambiar contraseña: " . $e->getMessage());
        return false;
    }
}



}
