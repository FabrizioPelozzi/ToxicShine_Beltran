<?php
    include_once "Conexion.php";
    class Categoria{
        var $objetos;
        public function __construct(){
            $db = new Conexion();
            $this->acceso = $db -> pdo;
        }
        function read_all_categorias(){
            $sql="SELECT *
                    FROM categoria
                    WHERE estado = 'A'";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchAll();
            return $this->objetos;
        }

        public function crear_categoria($nombre_categoria) {
            $sql = "INSERT INTO categoria(nombre_categoria)
                    VALUES(:nombre_categoria)";
            $query = $this->acceso->prepare($sql);
            $query->execute([
              ':nombre_categoria' => $nombre_categoria
            ]);
        }

        public function editar_categoria($id_categoria, $nombre_categoria_mod) {
            $sql = "UPDATE categoria
                    SET nombre_categoria = :nombre_categoria_mod
                    WHERE id_categoria = :id_categoria";
            $query = $this->acceso->prepare($sql);
            $query->execute([
              ':nombre_categoria_mod' => $nombre_categoria_mod,
              ':id_categoria'         => $id_categoria
            ]);
        }

        public function eliminar_categoria($id_categoria) {
            // Verificar si existen productos activos asociados a la categoría.
            $sqlCheck = "SELECT COUNT(*) as total FROM producto WHERE id_categoria = :id_categoria AND estado = 'A'";
            $query = $this->acceso->prepare($sqlCheck);
            $query->execute(array(":id_categoria" => $id_categoria));
            $result = $query->fetch(PDO::FETCH_ASSOC);
            
            if ($result['total'] > 0) {
                return false; // No se puede borrar si hay productos activos.
            }
            
            // Actualiza la categoría: verifica que el nombre de la tabla sea el correcto (categorias o categoria)
            $sql = "UPDATE categoria SET estado = 'I' WHERE id_categoria = :id_categoria";
            $query = $this->acceso->prepare($sql);
            $success = $query->execute(array(":id_categoria" => $id_categoria));
            
            $rowCount = $query->rowCount();
            error_log("Filas afectadas al inactivar categoría: " . $rowCount);
            
            return $success;
        }
        
        public function obtener_categorias() {
            $sql = "SELECT * FROM categoria WHERE estado = 'A' ORDER BY nombre_categoria ASC";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
        }  
        
        public function existe_categoria($nombre_categoria, $id_excluir = null) {
            $sql = "SELECT id_categoria, estado
                    FROM categoria
                    WHERE LOWER(TRIM(nombre_categoria)) = LOWER(TRIM(:nombre))";
            if ($id_excluir !== null) {
                $sql .= " AND id_categoria != :id_excluir";
            }
            $sql .= " LIMIT 1";
        
            $query = $this->acceso->prepare($sql);
            $params = [':nombre' => $nombre_categoria];
            if ($id_excluir !== null) {
                $params[':id_excluir'] = $id_excluir;
            }
            $query->execute($params);
        
            return $query->fetch(PDO::FETCH_ASSOC) ?: false;
        }        
        
        public function reactivar_categoria($id_categoria) {
            $sql = "UPDATE categoria
                    SET estado = 'A'
                    WHERE id_categoria = :id_categoria";
            $query = $this->acceso->prepare($sql);
            $query->execute([':id_categoria' => $id_categoria]);
        }             
    }