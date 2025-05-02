<?php

include_once 'Conexion.php'; 
class Compra {
    var $objetos;

    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    // Método para obtener el ID de un usuario por su DNI
    public function obtener_id_usuario_por_dni($dni) {
        $sql = "SELECT id_usuario FROM usuario WHERE dni = :dni";
        $query = $this->acceso->prepare($sql);
        $query->execute([":dni" => $dni]);
        return $query->fetch(PDO::FETCH_OBJ);
    }    

    // Método en Compra.php para obtener la información general de la compra
    public function obtener_compras_general($id_usuario) {
        $sql = "SELECT 
                    c.id_compra, 
                    c.fecha_compra, 
                    c.total
                FROM compra c
                WHERE c.id_usuario = :id_usuario
                ORDER BY c.fecha_compra DESC";
                
        $query = $this->acceso->prepare($sql);
        $query->execute([':id_usuario' => $id_usuario]);
        return $query->fetchAll(PDO::FETCH_OBJ);
    }

    // Método para obtener los detalles de una compra
    public function obtener_detalle_compra($id_compra) {
        $sql = "SELECT 
                    p.id_producto,
                    p.nombre_producto,
                    p.descripcion,
                    p.precio_venta,
                    cp.cantidad
                FROM compra_producto cp
                JOIN producto p ON cp.id_producto = p.id_producto
                WHERE cp.id_compra = :id_compra";
                
        $query = $this->acceso->prepare($sql);
        $query->execute([':id_compra' => $id_compra]);
        return $query->fetchAll(PDO::FETCH_OBJ);
    }


    
}
