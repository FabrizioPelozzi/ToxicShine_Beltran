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
if ($_POST['funcion'] === 'verificar_email') {
    $email = trim($_POST['value']);
    $resultado = $usuario->verificar_email($email);
    echo empty($resultado) ? 'success' : 'error';
    exit;
}

// 2) Enviar código
if ($_POST['funcion'] === 'enviar_codigo') {
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
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64'; 
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
    $mail->Body = "
        <!DOCTYPE html>
        <html lang=\"es\">
        <head>
          <meta charset=\"UTF-8\">
          <title>Recuperación de contraseña</title>
        </head>
        <body style=\"margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;\">
          <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">
            <tr>
              <td align=\"center\" style=\"padding:20px 0;\">
                <!-- Contenedor principal -->
                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background:#ffffff; border-radius:8px; overflow:hidden;\">
                  
                  <!-- Header -->
                  <tr>
                    <td align=\"center\" style=\"background:#007bff; padding:20px;\">
                      <h1 style=\"color:#ffffff; margin:0; font-size:24px;\">ToxicShineBeltran</h1>
                    </td>
                  </tr>
                  
                  <!-- Cuerpo -->
                  <tr>
                    <td style=\"padding:30px;\">
                      <p style=\"font-size:16px; color:#333333; margin:0 0 15px;\">Hola,</p>
                      
                      <p style=\"font-size:14px; color:#555555; line-height:1.6; margin:0 0 20px;\">
                        Nos comunicamos desde la plataforma de <strong>ToxicShineBeltran</strong> para informarte que hemos recibido una solicitud de recuperación de contraseña.
                      </p>
                      
                      <p style=\"font-size:16px; text-align:center; margin:0 0 20px;\">
                        <span style=\"display:inline-block; padding:10px 20px; background:#e9ecef; border-radius:4px; font-weight:bold; font-size:18px; letter-spacing:1px;\">
                          $codigo
                        </span>
                      </p>
                      
                      <p style=\"font-size:14px; color:#555555; line-height:1.6; margin:0 0 20px;\">
                        Si no fuiste tú, puedes ignorar este correo sin problema.
                      </p>
                      
                      <p style=\"font-size:14px; color:#555555; line-height:1.6; margin:0 0 30px;\">
                        Atentamente,<br>
                        <strong>El equipo de ToxicShineBeltran</strong>
                      </p>
                      
                      <hr style=\"border:none; border-top:1px solid #dddddd; margin:0 0 20px;\" />
                      
                      <p style=\"font-size:12px; color:#999999; text-align:center; margin:0;\">
                        No respondas a este correo. &copy; " . date('Y') . " ToxicShineBeltran. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
if ($_POST['funcion'] === 'validar_codigo') {
    $cod  = trim($_POST['codigo']);
    $ok   = ($cod === (string)$_SESSION['codigo_recuperacion']);
    echo $ok ? 'valido' : 'invalido';
    exit;
}

// 4) Cambiar contraseña
if ($_POST['funcion'] === 'cambiar_pass') {
    $email = $_SESSION['email_recuperacion'] ?? '';
    if (!$email) {
        echo "error";
        exit;
    }

    $nueva = $_POST['nueva_pass'] ?? '';

    $verif = $usuario->verificar_password($email, $nueva);
    if ($verif === null) {
        echo "error";
        exit;
    }
    if ($verif === true) {
        echo "same";
        exit;
    }

    $hash = password_hash($nueva, PASSWORD_DEFAULT);
    if ($usuario->cambiar_password($email, $hash)) {
        echo "success";
    } else {
        echo "error";
    }
    exit;
}

