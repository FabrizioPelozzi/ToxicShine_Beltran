<?php

include_once "Conexion.php";

class Carrito {
    private $acceso;
    
    // Constructor
    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    // Función para agregar un producto al carrito
    public function agregarProducto($id_usuario, $id_producto, $cantidad) {
        // Verificar si el usuario ya tiene un carrito activo
        $sql = "SELECT id_carrito FROM carrito WHERE id_usuario = :id_usuario";
        $query = $this->acceso->prepare($sql);
        $query->execute([":id_usuario" => $id_usuario]);
        $carrito = $query->fetch(PDO::FETCH_ASSOC);
    
        if (!$carrito) {
            // Crear un carrito si no existe
            $sql = "INSERT INTO carrito (id_usuario) VALUES (:id_usuario)";
            $query = $this->acceso->prepare($sql);
            $query->execute([":id_usuario" => $id_usuario]);
            $id_carrito = $this->acceso->lastInsertId();
        } else {
            $id_carrito = $carrito["id_carrito"];
        }
    
        // Verificar si el producto ya está en el carrito
        $sql = "SELECT cantidad FROM carrito_producto WHERE id_carrito = :id_carrito AND id_producto = :id_producto";
        $query = $this->acceso->prepare($sql);
        $query->execute([":id_carrito" => $id_carrito, ":id_producto" => $id_producto]);
        $productoExistente = $query->fetch(PDO::FETCH_ASSOC);
    
        if ($productoExistente) {
            // Actualizar la cantidad existente
            $nuevaCantidad = $productoExistente["cantidad"] + $cantidad;
            $sql = "UPDATE carrito_producto SET cantidad = :cantidad WHERE id_carrito = :id_carrito AND id_producto = :id_producto";
            $query = $this->acceso->prepare($sql);
            return $query->execute([
                ":cantidad" => $nuevaCantidad,
                ":id_carrito" => $id_carrito,
                ":id_producto" => $id_producto
            ]);
        } else {
            // Insertar el nuevo producto en el carrito
            $sql = "INSERT INTO carrito_producto (id_carrito, id_producto, cantidad) VALUES (:id_carrito, :id_producto, :cantidad)";
            $query = $this->acceso->prepare($sql);
            return $query->execute([
                ":id_carrito" => $id_carrito,
                ":id_producto" => $id_producto,
                ":cantidad" => $cantidad
            ]);
        }
    }

    // Función para leer los productos del carrito
    public function leer($id_usuario) {
        $sql = "SELECT 
                    cp.id_carrito_producto AS id,
                    p.nombre_producto AS titulo,
                    cp.cantidad,
                    p.precio_venta AS precio,
                    p.imagen_principal AS imagen,
                    p.descripcion AS descripcion,
                    p.id_producto AS id_producto,
                    cat.nombre_categoria AS categoria,
                    p.stock AS stock,
                    c.id_carrito AS id_carrito
                FROM carrito_producto cp
                INNER JOIN carrito c ON cp.id_carrito = c.id_carrito
                INNER JOIN producto p ON cp.id_producto = p.id_producto
                INNER JOIN categoria cat ON p.id_categoria = cat.id_categoria
                WHERE c.id_usuario = :id_usuario
                AND p.estado = 'A'";
        
        $query = $this->acceso->prepare($sql);
        $query->execute([":id_usuario" => $id_usuario]);
        $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
    }

    // Función para actualizar la cantidad de un producto en el carrito
    public function actualizar_cantidad($id, $cantidad) {
        $sql = "UPDATE carrito_producto SET cantidad = :cantidad WHERE id_carrito_producto = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':cantidad' => $cantidad,
            ':id' => $id
        ]);
    }

    // Función para eliminar un producto del carrito
    public function eliminar($id_carrito_producto, $id_usuario) {
        $sql = "DELETE cp
                FROM carrito_producto cp
                INNER JOIN carrito c ON cp.id_carrito = c.id_carrito
                WHERE cp.id_carrito_producto = :id_carrito_producto AND c.id_usuario = :id_usuario";
        $query = $this->acceso->prepare($sql);
        return $query->execute([
            ":id_carrito_producto" => $id_carrito_producto,
            ":id_usuario" => $id_usuario
    
        
        ]);
    
    }

    public function obtener_cantidad_por_producto($id_producto) {
        // 1) Consulta: une carrito con carrito_producto y suma la cantidad
        $sql = "
            SELECT 
                COALESCE(SUM(cp.cantidad), 0) AS total 
            FROM carrito_producto cp
            INNER JOIN carrito c 
                ON c.id_carrito = cp.id_carrito
            WHERE 
                c.id_usuario   = :usuario
                AND cp.id_producto = :id
        ";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':usuario' => $_SESSION['id_usuario'],
            ':id'      => $id_producto
        ]);
        $row = $query->fetch(PDO::FETCH_ASSOC);
    
        // 2) Si no hay filas devuelve 0
        return intval($row['total']);
    }


    public function obtener_stock($id_producto) {
        $sql = "SELECT stock FROM producto WHERE id_producto = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute([":id" => $id_producto]);
        $row = $query->fetch(PDO::FETCH_ASSOC);
        return $row ? intval($row['stock']) : 0;
    }
}

