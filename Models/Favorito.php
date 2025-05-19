<?php
    include_once "Conexion.php";
    class Favorito{
        var $objetos;
        public function __construct(){
            $db = new Conexion();
            $this->acceso = $db -> pdo;
        }
    
    // Funcion para leer los productos favoritos
    function leer_favorito_usuario_producto($usuario_sesion,$id_producto){
            $sql="SELECT *
                 FROM favorito
                 WHERE id_usuario=:id_usuario
                 AND id_producto=:id_producto";
            $query = $this->acceso->prepare($sql);
            $variables=array(
                ":id_usuario" => $usuario_sesion,
                ":id_producto" => $id_producto
            );
            $query->execute($variables);
            $this->objetos = $query->fetchAll();
            return $this->objetos;
    }

    // Funcion para sacar de favorito un producto 
    function update_remove($id_favorito) {
            $sql = "UPDATE favorito
                    SET estado=:estado
                    WHERE id=:id_favorito";
                    $query = $this->acceso->prepare($sql);
                    $variables=array(
                        ":id_favorito" => $id_favorito,
                        ":estado" => "I"
            );
            $query->execute($variables);
    }

    // Funcion para anadir un producto a favorito
    function update_add($id_usuario,$id_producto,$id_favorito,$url) {
        if ($id_favorito!="") {
            $sql = "UPDATE favorito
                SET estado=:estado
                WHERE id=:id_favorito";
                $query = $this->acceso->prepare($sql);
                $variables=array(
                    ":id_favorito" => $id_favorito,
                    ":estado" => "A"
                );
                $query->execute($variables);
        }else {
            $sql = "INSERT INTO favorito(url,id_usuario,id_producto)
                    VALUES (:url, :id_usuario, :id_producto)";
                    
                $query = $this->acceso->prepare($sql);
                $variables=array(
                    ":url" => $url,
                    ":id_usuario" => $id_usuario,
                    ":id_producto" => $id_producto,
                );
                $query->execute($variables);
        }
        
    }
    // Funcion para leer los productos favoritos
    function read($id_usuario){
        $sql='SELECT f.id as id,
                     p.nombre_producto as titulo,
                     p.precio_venta as precio,
                     p.imagen_principal as imagen,
                     f.url as url
             FROM favorito f
             JOIN producto p ON f.id_producto = p.id_producto
             WHERE f.id_usuario=:id_usuario
             AND f.estado="A"
             AND p.estado="A"';
        $query = $this->acceso->prepare($sql);
        $variables=array(
            ":id_usuario" => $id_usuario
        );
        $query->execute($variables);
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    // Funcion para leer todos los productos favoritos
    function read_all_favoritos($id_usuario){
        $sql='SELECT 
                    f.id AS id,
                    p.nombre_producto AS titulo,
                    p.precio_venta AS precio,
                    p.imagen_principal AS imagen,
                    f.url AS url,
                    p.descripcion AS descripcion,
                    c.nombre_categoria AS categoria
              FROM favorito f
              JOIN producto p ON f.id_producto = p.id_producto
              JOIN categoria c ON p.id_categoria = c.id_categoria
              WHERE f.id_usuario = :id_usuario
              AND f.estado = "A"
              AND p.estado = "A"';
              
        $query = $this->acceso->prepare($sql);
        $query->execute([":id_usuario" => $id_usuario]);
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    
}