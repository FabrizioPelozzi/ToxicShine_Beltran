<?php
    include_once "Conexion.php";
    class Producto{
        var $objetos;
        var $acceso;
    
        public function __construct() {
            $db = new Conexion();
            $this->acceso = $db->pdo;
        }
    
        // Funcion para leer todos los productos
        function llenar_productos($id=null) {
            if ($id) {
                $sql = "SELECT p.id_producto as id,
                               p.nombre_producto as producto,
                               p.imagen_principal as imagen,
                               p.descripcion as descripcion,
                               p.precio_venta as precio,
                               p.stock as stock,
                               c.nombre_categoria as categoria
                        FROM producto p 
                        JOIN categoria c ON p.id_categoria = c.id_categoria
                        WHERE p.estado='A' AND p.id_producto=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(":id"=>$id));
                $this->objetos = $query->fetchAll();
                return $this->objetos;
            } else {
                $sql = "SELECT p.id_producto as id,
                               p.nombre_producto as producto,
                               p.imagen_principal as imagen,
                               p.descripcion as descripcion,
                               p.precio_venta as precio,
                               p.stock as stock,
                               c.nombre_categoria as categoria
                        FROM producto p 
                        JOIN categoria c ON p.id_categoria = c.id_categoria
                        WHERE p.estado='A'";
                $query = $this->acceso->prepare($sql);
                $query->execute();
                $this->objetos = $query->fetchAll();
                return $this->objetos;
            }
        }
        
        // Funcion para capturar las imagenes
        function capturar_imagenes($id){
            $sql = "SELECT *
                    FROM imagen
                    WHERE imagen.id_producto = :id_producto
                    AND imagen.estado = 'A'";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(":id_producto"=>$id));
            $this->objetos = $query->fetchAll();
            return $this->objetos;
        }

        // Funcion para filtrar los productos
        public function filtrar_productos($categoria, $min_precio, $max_precio, $stock, $nombre) {
            $sql = "SELECT 
                p.id_producto AS id,
                p.nombre_producto AS producto,
                p.imagen_principal AS imagen,
                p.precio_venta AS precio,
                p.stock,
                c.nombre_categoria AS categoria 
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE 1=1";

        
            if ($categoria != "") {
                $sql .= " AND p.id_categoria = :categoria";
            }
            if ($min_precio != "") {
                $sql .= " AND p.precio_venta >= :min_precio";
            }
            if ($max_precio != "") {
                $sql .= " AND p.precio_venta <= :max_precio";
            }
            if ($stock == "con_stock") {
                $sql .= " AND p.stock > 0";
            } elseif ($stock == "sin_stock") {
                $sql .= " AND p.stock = 0";
            }
            if ($nombre != "") {
                $sql .= " AND p.nombre_producto LIKE :nombre";
            }
        
            $query = $this->acceso->prepare($sql);
        
            if ($categoria != "") $query->bindParam(":categoria", $categoria);
            if ($min_precio != "") $query->bindParam(":min_precio", $min_precio);
            if ($max_precio != "") $query->bindParam(":max_precio", $max_precio);
            if ($nombre != "") $query->bindValue(":nombre", "%$nombre%");
        
            $query->execute();
            $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
        }        
}