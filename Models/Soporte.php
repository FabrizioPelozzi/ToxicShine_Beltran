<?php
include_once 'Conexion.php';
class Soporte {
    private $db;

    public function __construct() {
        $this->db = (new Conexion())->pdo;
    }

    /** Crear un nuevo ticket */
    public function crear_ticket($email, $telefono, $nombre, $apellido, $dni, $tipo, $descripcion) {
        $sql = "INSERT INTO soporte 
                  (email, telefono, nombre, apellido, dni, tipo, descripcion)
                VALUES
                  (:email, :telefono, :nombre, :apellido, :dni, :tipo, :descripcion)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':email'       => $email,
            ':telefono'    => $telefono,
            ':nombre'      => $nombre,
            ':apellido'    => $apellido,
            ':dni'         => $dni,
            ':tipo'        => $tipo,
            ':descripcion' => $descripcion
        ]);
    }

    /** Leer todos los tickets (o filtrar por estado/tipo) */
    public function leer_tickets($estado = null, $tipo = null) {
        $sql = "SELECT * FROM soporte WHERE 1=1";
        if ($estado) $sql .= " AND estado = :estado";
        if ($tipo)   $sql .= " AND tipo   = :tipo";
        $sql .= " ORDER BY creado_at DESC";
        $stmt = $this->db->prepare($sql);
        if ($estado && $tipo) {
            $stmt->execute([':estado'=>$estado, ':tipo'=>$tipo]);
        } elseif ($estado) {
            $stmt->execute([':estado'=>$estado]);
        } elseif ($tipo) {
            $stmt->execute([':tipo'=>$tipo]);
        } else {
            $stmt->execute();
        }
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /** Obtener un ticket por ID */
    public function obtener_ticket($id_ticket) {
        $stmt = $this->db->prepare("SELECT * FROM soporte WHERE id_ticket = :id");
        $stmt->execute([':id'=>$id_ticket]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /** Actualizar estado, respuesta y asignado */
    public function actualizar_ticket($id_ticket, $estado, $respuesta, $asignado_a = null) {
        $sql = "UPDATE soporte
                   SET estado       = :estado,
                       respuesta    = :respuesta,
                       asignado_a   = :asignado
                 WHERE id_ticket   = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':estado'     => $estado,
            ':respuesta'  => $respuesta,
            ':asignado'   => $asignado_a,
            ':id'         => $id_ticket
        ]);
    }
}
