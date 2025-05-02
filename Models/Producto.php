<?php
    include_once "Conexion.php";
    class Producto{
        var $objetos;
        public function __construct(){
            $db = new Conexion();
            $this->acceso = $db -> pdo;
        }

        // Funcion para leer todos los productos
        function read_all_productos(){
            $sql = "SELECT p.id_producto, p.nombre_producto, p.precio_venta, p.descripcion, 
                    p.imagen_principal, p.id_categoria, p.stock, p.estado, 
                    c.nombre_categoria, p.fecha_creacion, p.fecha_edicion
                    FROM producto p
                    JOIN categoria c ON p.id_categoria = c.id_categoria
                    WHERE p.estado = 'A'";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchAll();
            return $this->objetos;
        }
        
        // Funcion para buscar productos
        function buscar_productos_filtrados($nombre, $categoria, $stock, $precio_max){
            $sql = "SELECT * FROM productos WHERE 1";
            $params = [];
        
            if (!empty($nombre)) {
                $sql .= " AND producto LIKE ?";
                $params[] = "%$nombre%";
            }
            if (!empty($categoria)) {
                $sql .= " AND categoria = ?";
                $params[] = $categoria;
            }
            if ($stock !== "") {
                $sql .= " AND stock " . ($stock == 1 ? "> 0" : "= 0");
            }
            if (!empty($precio_max)) {
                $sql .= " AND precio <= ?";
                $params[] = $precio_max;
            }
        
            $query = $this->acceso->prepare($sql);
            $query->execute($params);
            $resultado = $query->fetchAll(PDO::FETCH_ASSOC);
            return $resultado;
        }        
        
        // Funcion para crear un producto
        function crear_producto($nombre_producto, $categoria_producto, $descripcion_producto, $precio_producto, $imagen_final, $stock) {
            // Escapar las variables con htmlspecialchars (para evitar XSS)
            $nombre_producto    = htmlspecialchars($nombre_producto);
            $categoria_producto = htmlspecialchars($categoria_producto);
            $descripcion_producto = htmlspecialchars($descripcion_producto);
            $precio_producto    = htmlspecialchars($precio_producto);
            $imagen_final       = htmlspecialchars($imagen_final);
            $stock              = htmlspecialchars($stock);
            
            // Crear la consulta SQL incluyendo la columna stock
            $sql = "INSERT INTO producto (
                nombre_producto,
                id_categoria,
                descripcion,
                precio_venta,
                imagen_principal,
                stock,
                fecha_creacion,
                fecha_edicion
            ) VALUES (
                :nombre_producto,
                :categoria_producto,
                :descripcion_producto,
                :precio_producto,
                :imagen_final,
                :stock,
                NOW(),
                NOW()
            )";
            
            // Preparar la consulta
            $query = $this->acceso->prepare($sql);
            
            // Ejecutar la consulta con los parámetros
            $query->execute(array(
                ":nombre_producto"    => $nombre_producto,
                ":categoria_producto" => $categoria_producto,
                ":descripcion_producto" => $descripcion_producto,
                ":precio_producto"    => $precio_producto,
                ":imagen_final"       => $imagen_final,
                ":stock"              => $stock
            ));
        } 

        // Funcion para leer todas las categorias
        function read_all_categorias() {
            $query = "SELECT id_categoria, nombre_categoria FROM categorias";
            $resultado = $this->acceso->query($query);
        
            $categorias = [];
            while ($categoria = $resultado->fetch_assoc()) {
                $categorias[] = $categoria;
            }
        
            return $categorias;
        }
        
        // Funcion para leer un producto
        function obtener_producto($id_producto) {
            $sql = "SELECT p.id_producto, p.nombre_producto, p.precio_venta, p.descripcion, p.imagen_principal, p.id_categoria, p.stock, c.nombre_categoria, p.estado
                    FROM producto p
                    JOIN categoria c ON p.id_categoria = c.id_categoria
                    WHERE p.id_producto = :id_producto
                    AND p.estado = 'A'";            
            $query = $this->acceso->prepare($sql);
            $query->execute(array(":id_producto" => $id_producto));
            $this->objetos = $query->fetchAll(PDO::FETCH_OBJ); // Recupera como objetos
            return $this->objetos; // Devuelve el resultado
        }
        
        // Funcion para editar un producto
        function editar_producto($id_producto, $nombre_producto, $id_categoria, $descripcion, $precio_venta, $imagen_principal, $stock) {
            $sql = "UPDATE producto
                    SET nombre_producto   = :nombre_producto,
                        id_categoria      = :id_categoria,
                        descripcion       = :descripcion,
                        precio_venta      = :precio_venta,
                        imagen_principal  = :imagen_principal,
                        stock             = :stock,
                        fecha_edicion     = NOW()
                    WHERE id_producto      = :id_producto";
            
            $query = $this->acceso->prepare($sql);
            $query->execute([
                ":nombre_producto"   => $nombre_producto,
                ":id_categoria"      => $id_categoria,
                ":descripcion"       => $descripcion,
                ":precio_venta"      => $precio_venta,
                ":imagen_principal"  => $imagen_principal,
                ":stock"             => $stock,
                ":id_producto"       => $id_producto
            ]);
            return true;
        }
        
        // Funcion para eliminar un producto
        function eliminar_producto($id_producto) {
            $sql = "UPDATE producto SET estado = 'I' WHERE id_producto = :id_producto";
            $query = $this->acceso->prepare($sql);
            $variables = array(":id_producto" => $id_producto);
            $query->execute($variables);
        }

        // Funcion para obtener las imagenes
        public function obtener_imagenes($id_producto) {
            $sql = "SELECT id, nombre, estado 
                    FROM imagen 
                    WHERE id_producto = :id_producto";
        
            $query = $this->acceso->prepare($sql);
            $variables = array(":id_producto" => $id_producto);
            $query->execute($variables);
            $this->objetos = $query->fetchAll(PDO::FETCH_ASSOC);
            return $this->objetos;
        }

        // Funcion para gestionar las imagenes
        public function gestionar_imagenes($id_producto, $ids, $estados, $nombres) {
            try {
                foreach ($ids as $key => $id_imagen) {
                    $estado = $estados[$key];
                    // Si es una imagen nueva, se inserta (usando el nombre subido)
                    if ($id_imagen == "nueva") {
                        if (!empty($nombres[$key])) {
                            $sql = "INSERT INTO imagen (nombre, id_producto, estado) 
                                    VALUES (:nombre, :id_producto, :estado)";
                            $query = $this->acceso->prepare($sql);
                            $query->execute([
                                ':nombre'      => $nombres[$key],
                                ':id_producto' => $id_producto,
                                ':estado'      => $estado
                            ]);
                        } else {
                            // Si no se proporcionó un archivo para la imagen nueva, se omite
                            continue;
                        }
                    } else {
                        // Para imágenes existentes, solo se actualiza el estado
                        $sql = "UPDATE imagen SET estado = :estado WHERE id = :id";
                        $query = $this->acceso->prepare($sql);
                        $query->execute([
                            ':estado' => $estado,
                            ':id'     => $id_imagen
                        ]);
                    }
                }
                return true;
            } catch (Exception $e) {
                error_log("Error al gestionar imágenes: " . $e->getMessage());
                return false;
            }
        }             
        
        // Funcion para eliminar una imagen
        public function eliminar_imagen($id_imagen) {
            try {
                $sql = "DELETE FROM imagen WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute([':id' => $id_imagen]);
                return true;
            } catch (Exception $e) {
                error_log("Error al eliminar imagen: " . $e->getMessage());
                return false;
            }
        }
        
        // Devuelve el registro completo si existe (activo o inactivo), o false si no.
        public function existe_producto($nombre_producto) {
            $sql = "SELECT * 
                    FROM producto 
                    WHERE nombre_producto = :nombre_producto";
            $query = $this->acceso->prepare($sql);
            $query->execute([':nombre_producto' => $nombre_producto]);
            return $query->fetch(PDO::FETCH_ASSOC) ?: false;
        }

        // Reactiva (cambia estado a 'A') un producto dado su ID
        public function reactivar_producto($id_producto) {
            $sql = "UPDATE producto 
                    SET estado = 'A' 
                    WHERE id_producto = :id_producto";
            $query = $this->acceso->prepare($sql);
            $query->execute([':id_producto' => $id_producto]);
        }

        // Comprueba si existe otro producto con el mismo nombre
        public function existe_otro_producto_con_nombre(string $nombre_producto, int $id_excluir): bool {
            $sql = "SELECT 1
                    FROM producto
                    WHERE nombre_producto = :nombre
                      AND id_producto <> :id_excluir
                    LIMIT 1";
            $stmt = $this->acceso->prepare($sql);
            $stmt->execute([
                ':nombre'      => $nombre_producto,
                ':id_excluir'  => $id_excluir
            ]);
            $result = (bool) $stmt->fetchColumn(); 
            return $result;
        }        
    }