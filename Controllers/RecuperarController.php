<?php
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

session_start();
header('Content-Type: text/plain');

include_once '../Models/Usuario.php';
$usuario = new Usuario();

// 1) Verificar email
if (isset($_POST['funcion']) && $_POST['funcion'] === 'verificar_email') {
    $email = trim($_POST['value']);
    $resultado = $usuario->verificar_email($email);
    echo empty($resultado) ? 'success' : 'error';
    exit;
}

// 2) Enviar código
if (isset($_POST['funcion']) && $_POST['funcion'] === 'enviar_codigo') {
    $email = trim($_POST['email']);

    // compruebo que exista el email
    if (empty($usuario->verificar_email($email))) {
        echo 'no_existe';
        exit;
    }

    // genero y guardo código
    $codigo = rand(100000, 999999);
    $_SESSION['codigo_recuperacion'] = $codigo;
    $_SESSION['email_recuperacion']  = $email;

    // configuro PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'soportetoxicshinebeltran@gmail.com';
    $mail->Password   = 'govr iznc pffd iioc';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->setFrom('soportetoxicshinebeltran@gmail.com', 'ToxicShineBeltran');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Recuperación de contraseña';
    $mail->Body    = "
      <p>Hola,</p>
      <p>Tu código de verificación es: <strong style='font-size:1.2em;'>$codigo</strong></p>
      <p>Si no fuiste tú, ignora este correo.</p>
    ";

    try {
        $mail->send();
        echo 'enviado';
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        echo 'error_mail';
    }
    exit;
}

// 3) Validar código
if (isset($_POST['funcion']) && $_POST['funcion'] === 'validar_codigo') {
    $cod  = trim($_POST['codigo']);
    $ok   = ($cod === (string)$_SESSION['codigo_recuperacion']);
    echo $ok ? 'valido' : 'invalido';
    exit;
}

// 4) Cambiar contraseña
if (isset($_POST['funcion']) && $_POST['funcion'] === 'cambiar_pass') {
    $nueva   = password_hash($_POST['nueva_pass'], PASSWORD_DEFAULT);
    $result  = $usuario->cambiar_password($_SESSION['email_recuperacion'], $nueva);
    // limpiar sesión
    unset($_SESSION['codigo_recuperacion'], $_SESSION['email_recuperacion']);

    echo $result ? 'success' : 'error_pass';
    exit;
}


// Si llega aquí, petición desconocida
echo 'error';
exit;
