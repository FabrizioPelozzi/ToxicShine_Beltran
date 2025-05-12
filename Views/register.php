<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Register | ToxicShineBeltran</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../Util/Css/css/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../Util/Css/adminlte.min.css">
  <link rel="stylesheet" href="../Util/Css/toastr.min.css">
  <link rel="stylesheet" href="../Util/Css/sweetalert2.min.css">
</head>
<div class="modal fade" id="terminos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Términos y Condiciones</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
        <h6><strong>Términos y Condiciones de Uso</strong></h6>
        <p><em>Última actualización: 16/04/2025</em></p>

        <p>Antes de registrarte y utilizar nuestra plataforma, por favor, lee atentamente estos Términos y Condiciones. Al crear una cuenta, aceptas estar legalmente vinculado a los siguientes términos:</p>

        <ol>
          <li>
            <strong>Aceptación de los Términos</strong>
            <p>Al registrarte en nuestro sistema, aceptas cumplir con estos Términos y Condiciones, así como con nuestras políticas de privacidad y cualquier otra norma aplicable.</p>
          </li>
          <li>
            <strong>Registro de Usuario</strong>
            <p>Debes proporcionar información veraz, completa y actualizada al momento del registro. Eres responsable de mantener la confidencialidad de tus credenciales de acceso. No se permite el uso de cuentas falsas o suplantación de identidad.</p>
          </li>
          <li>
            <strong>Uso Permitido</strong>
            <p>El sistema debe ser utilizado únicamente para fines legales y conforme a su propósito original. Está prohibido realizar actividades fraudulentas, distribuir virus o cualquier otro software malicioso.</p>
          </li>
          <li>
            <strong>Privacidad</strong>
            <p>La información personal que proporciones será utilizada únicamente con fines relacionados con el funcionamiento de la plataforma. No compartiremos tus datos con terceros sin tu consentimiento, salvo que sea requerido por ley.</p>
          </li>
          <li>
            <strong>Propiedad Intelectual</strong>
            <p>Todos los contenidos, marcas, logos y elementos visuales del sistema son propiedad del titular del programa, salvo indicación contraria. No está permitido copiarlos, distribuirlos o modificarlos sin autorización.</p>
          </li>
          <li>
            <strong>Suspensión o Terminación de Cuenta</strong>
            <p>Nos reservamos el derecho de suspender o cancelar tu cuenta en caso de detectar comportamientos que violen estos Términos.</p>
          </li>
          <li>
            <strong>Modificaciones</strong>
            <p>Podemos actualizar estos Términos en cualquier momento. Notificaremos cambios importantes y, al continuar usando el sistema, aceptas los nuevos términos.</p>
          </li>
        </ol>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-block" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


<style>
    .profile-user {
      width: 50px;  /* Ajusta el tamaño aquí */
      height: 50px;
      object-fit: cover;  /* Esto asegura que la imagen mantenga buena calidad sin distorsionarse */
    }
</style>
<body class="hold-transition login-page">
<div class="mt-5">
  <div class="login-logo">
    <div class="d-flex align-items-center justify-content-center">
      <!-- Ajustar tamaño de la imagen -->
      <img src="../Util/Img/avatar5.png" class="profile-user img-fluid img-circle" style="width: 50px; height: 50px;">
      <!-- Espacio entre la imagen y el texto -->
      <a href="Index.php" style="margin-left: 10px;"><b>Toxic</b>SHINE</a>
    </div>
  </div>
  <!-- /.login-logo -->
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-12 col-lg-10">
        <div class="card">
          <div class="card-body login-card-body">
            <p class="login-box-msg">Registrarse</p>
              <form id="form-register">
                  <div class="row">
                      <div class="col-sm-12">
                          <div class="form-group">
                              <label for="email">Correo electronico</label>
                              <input type="email" name="email" class="form-control" id="email" placeholder="Ingrese el correo electronico" autocomplete="off">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="pass">Contraseña</label>
                              <input type="password" name="pass" class="form-control" id="pass" placeholder="Ingrese la contraseña" autocomplete="off">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="pass_repeat">Repita la Contraseña</label>
                              <input type="password" name="pass_repeat" class="form-control" id="pass_repeat" placeholder="Ingrese la contraseña de nuevo">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="nombres">Nombres</label>
                              <input type="text" name="nombres" class="form-control" id="nombres" placeholder="Ingrese su nombre">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="apellidos">Apellidos</label>
                              <input type="text" name="apellidos" class="form-control" id="apellidos" placeholder="Ingrese su apellido">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="dni">DNI</label>
                              <input type="text" name="dni" class="form-control" id="dni" placeholder="Ingrese su DNI">
                          </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                              <label for="telefono">Telefono</label>
                              <input type="number" name="telefono" class="form-control" id="telefono" placeholder="Ingrese su N° de telefono">
                          </div>
                      </div>
                      <div class="col-sm-12">
                          <div class="form-group mb-0">
                              <div class="custom-control custom-checkbox">
                                  <input type="checkbox" name="terms" class="custom-control-input" id="terms">
                                  <label class="custom-control-label" for="terms">Estoy de acuerdo con los<a href="#" data-toggle="modal" data-target="#terminos"> terminos del servicio</a>.</label>
                          </div>
                      </div>
                  </div>
                      <!-- /.card-body -->
                      <div class="card-footer text-center">
                          <button type="submit" class="btn btn-lg bg-gradient-primary">Registrarme</button>
                      </div>
              </form>
          </div>
          <!-- /.login-card-body -->
        </div>
      </div>
    </div>
  </div>
</div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="../Util/Js/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="../Util/Js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="../Util/Js/adminlte.min.js"></script>
<script src="../Util/Js/jquery.validate.min.js"></script>
<script src="../Util/Js/additional-methods.min.js"></script>
<script src="../Util/Js/sweetalert2.min.js"></script>
<script src="register.js"></script>

<script src="../Util/Js/toastr.min.js"></script>
</body>
</html>
