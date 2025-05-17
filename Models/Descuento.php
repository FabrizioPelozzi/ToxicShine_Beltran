<?php
include_once "Conexion.php";

class Descuento {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->pdo;
    }

    public function getActiveBetween($start, $end) {
        $sql = "SELECT 
                    d.id_descuento,
                    p.id_producto,
                    p.nombre_producto AS producto,
                    p.precio_venta    AS precio_orig,
                    c.nombre_categoria AS categoria,
                    d.porcentaje,
                    d.inicio,
                    d.fin
                FROM descuento d
                JOIN producto p ON d.id_producto = p.id_producto
                JOIN categoria c ON p.id_categoria = c.id_categoria
                WHERE d.inicio <= :now 
                  AND d.fin    >= :now
                  AND p.estado = 'A'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':now', $start);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crear_descuento(array $data) {
       $sql = "INSERT INTO descuento 
           (id_producto, porcentaje, inicio, fin)
        VALUES 
           (:id_producto, :porcentaje, :inicio, :fin)
        ON DUPLICATE KEY UPDATE
           porcentaje = VALUES(porcentaje),
           inicio     = VALUES(inicio),
           fin        = VALUES(fin)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id_producto' => $data['id_producto'],
            ':porcentaje'  => $data['porcentaje'],
            ':inicio'      => $data['inicio'],
            ':fin'         => $data['fin']
        ]);
    }

    public function getProductosPorCategorias(array $cats) {
        if (empty($cats)) {
            return [];
        }
        $placeholders = implode(',', array_fill(0, count($cats), '?'));
        $sql = "SELECT id_producto 
                FROM producto 
                WHERE id_categoria IN ($placeholders)
                  AND estado = 'A'";        // Filtra sólo productos activos
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($cats);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar_descuento(int $id) {
        $stmt = $this->pdo->prepare("DELETE FROM descuento WHERE id_descuento = ?");
        $stmt->execute([$id]);
    }

    public function editar_descuento(int $id, float $porc, string $inicio, string $fin) {
        $sql = "UPDATE descuento
                   SET porcentaje = :porc,
                       inicio     = :inicio,
                       fin        = :fin
                 WHERE id_descuento = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
          ':porc'    => $porc,
          ':inicio'  => $inicio,
          ':fin'     => $fin,
          ':id'      => $id
        ]);
    }

}
