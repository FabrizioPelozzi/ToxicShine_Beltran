<?php
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Mostrar errores en pantalla (solo para pruebas)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$mail = new PHPMailer(true);
// Nivel de debug: DEBUG_SERVER = 2
$mail->SMTPDebug  = SMTP::DEBUG_SERVER;
$mail->Debugoutput = function($str, $level) {
    echo "[DEBUG][$level] $str<br>";
};

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'soportetoxicshinebeltran@gmail.com';
    $mail->Password   = 'govr iznc pffd iioc';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('soportetoxicshinebeltran@gmail.com','Test PHPMailer');
    $mail->addAddress('tu_correo_de_prueba@dominio.com');
    $mail->Subject = 'Prueba SMTP directo';
    $mail->Body    = 'Si ves esto, ¡funcionó!';

    $mail->send();
    echo "=== Mail enviado correctamente ===";
} catch (Exception $e) {
    echo "=== Excepción capturada: {$mail->ErrorInfo} ===";
}
