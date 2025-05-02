<?php
include_once "Conexion.php";
class Usuario {
    var $objetos;

    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    // Funcion para loguearse
    function loguearse($user, $pass) {
        $sql = "SELECT * FROM usuario WHERE email = :user AND contrasena = :pass";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(":user" => $user, ":pass" => $pass));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
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
    function registrar_usuario($email, $pass, $nombres, $apellidos, $dni, $telefono) {
        try {
            $this->acceso->beginTransaction();
            $sql_tipo_usuario = "SELECT id_tipo_usuario FROM tipo_usuario WHERE tipo_usuario = 'cliente'";
            $query_tipo_usuario = $this->acceso->prepare($sql_tipo_usuario);
            $query_tipo_usuario->execute();
            $id_tipo_usuario = $query_tipo_usuario->fetchColumn();
    
            $sql_usuario = "INSERT INTO usuario (email, contrasena, dni, nombre, apellido, telefono, id_tipo_usuario, estado) 
                            VALUES (:email, :pass, :dni, :nombre, :apellido, :telefono, :id_tipo_usuario, 'A')";
            $query_usuario = $this->acceso->prepare($sql_usuario);
            $query_usuario->execute(array(
                ":email" => $email,
                ":pass" => $pass,
                ":dni" => $dni,
                ":nombre" => $nombres,
                ":apellido" => $apellidos,
                ":telefono" => $telefono,
                ":id_tipo_usuario" => $id_tipo_usuario
            ));
            
            $this->acceso->commit();
        } catch (Exception $e) {
            $this->acceso->rollBack();
            error_log("Error en registro de usuario: " . $e->getMessage());
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
}
