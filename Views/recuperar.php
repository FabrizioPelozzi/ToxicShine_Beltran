<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recuperar Contraseña | ToxicShineBeltran</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../Util/Css/css/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../Util/Css/adminlte.min.css">
  <link rel="stylesheet" href="../Util/Css/toastr.min.css">
</head>
<style>
  .profile-user {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
</style>
<body class="hold-transition login-page">
  <div class="login-box">
    <div class="login-logo">
      <div class="d-flex align-items-center justify-content-center">
        <img src="../Util/Img/avatar5.png" class="profile-user img-fluid img-circle">
        <a href="Index.php" style="margin-left: 10px;"><b>Toxic</b>SHINE</a>
      </div>
    </div>
    <!-- /.login-logo -->
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Recuperación de contraseña</p>

        <form id="form_recuperar">
          <!-- Paso 1: Ingresar email -->
          <div id="step_email">
            <div class="input-group mb-3">
              <input id="email" name="email" type="email" class="form-control" placeholder="Correo electrónico" required>
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Enviar código</button>
          </div>

          <!-- Paso 2: Ingresar código (oculto inicialmente) -->
          <div id="step_codigo" style="display: none;">
            <div class="input-group mb-3 mt-3">
              <input id="codigo" name="codigo" type="text" class="form-control" placeholder="Código recibido">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-key"></span>
                </div>
              </div>
            </div>
            <button type="button" id="validar_codigo" class="btn btn-success btn-block">Validar código</button>
          </div>

          <!-- Paso 3: Nueva contraseña (oculto inicialmente) -->
          <div id="step_nueva_pass" style="display: none;">
            <div class="input-group mb-3 mt-3">
              <input id="nueva_pass" name="nueva_pass" type="password" class="form-control" placeholder="Nueva contraseña">
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <button type="button" id="cambiar_pass" class="btn btn-warning btn-block">Cambiar contraseña</button>
          </div>
        </form>

        <p class="mt-3 mb-0">
          <a href="login.php">Volver al login</a>
        </p>
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
  <!-- /.login-box -->

  <!-- Scripts -->
  <script src="../Util/Js/jquery.min.js"></script>
  <script src="../Util/Js/jquery.validate.min.js"></script>
  <script src="../Util/Js/bootstrap.bundle.min.js"></script>
  <script src="../Util/Js/adminlte.min.js"></script>
  <script src="../Util/Js/toastr.min.js"></script>
  <script src="recuperar.js"></script>
</body>
</html>
