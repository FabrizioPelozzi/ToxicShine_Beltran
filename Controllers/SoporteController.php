<?php
header('Content-Type: application/json; charset=UTF-8');
include_once "../Models/Soporte.php";
session_start();

$soporte = new Soporte();
$funcion = $_POST['funcion'] ?? '';

switch($funcion) {
  case 'enviar_soporte':
    // Crear ticket
    $ok = $soporte->crear_ticket(
      $_POST['email'],
      $_POST['telefono'],
      $_POST['nombre'],
      $_POST['apellido'],
      $_POST['dni'],
      $_POST['tipo'],
      $_POST['descripcion']
    );
    echo $ok ? json_encode(['status'=>'success']) 
             : json_encode(['status'=>'error']);
    break;

  case 'leer_tickets':
    // Opcional: filtro por estado/tipo
    $tickets = $soporte->leer_tickets(
      $_POST['filtro_estado'] ?? null,
      $_POST['filtro_tipo']   ?? null
    );
    echo json_encode($tickets);
    break;

  case 'obtener_ticket':
    $ticket = $soporte->obtener_ticket(intval($_POST['id_ticket']));
    echo json_encode($ticket);
    break;

  case 'actualizar_ticket':
    // Solo admins (puedes chequear sesión/id_tipo aquí)
    $ok = $soporte->actualizar_ticket(
      intval($_POST['id_ticket']),
      $_POST['estado'],
      $_POST['respuesta'],
      $_SESSION['id_usuario']  // quien atiende
    );
    echo $ok ? json_encode(['status'=>'success']) 
             : json_encode(['status'=>'error']);
    break;

  default:
    echo json_encode(['status'=>'unknown_function']);
}
