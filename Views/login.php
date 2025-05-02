<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Log in | ToxicShineBeltran</title>

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
      width: 50px;  /* Ajusta el tamaño aquí */
      height: 50px;
      object-fit: cover;  /* Esto asegura que la imagen mantenga buena calidad sin distorsionarse */
    }
</style>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="login-logo">
    <div class="d-flex align-items-center justify-content-center">
      <!-- Ajustar tamaño de la imagen -->
      <img src="../Util/Img/avatar5.png" class="profile-user img-fluid img-circle" style="width: 50px; height: 50px;">
      <!-- Espacio entre la imagen y el texto -->
      <a href="../Index.php" style="margin-left: 10px;"><b>Toxic</b>SHINE</a>
    </div>
  </div>
  <!-- /.login-logo -->
  <div class="card">
    <div class="card-body login-card-body">
      <p class="login-box-msg">inicie sesión</p>

      <form id="form-login">
        <div class="input-group mb-3">
          <input id="user" type="text" class="form-control" placeholder="Email" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-user"></span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input id="pass" type="password" class="form-control" placeholder="Contraseña" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock"></span>
            </div>
          </div>
        </div>
        <div class="social-auth-links text-center mb-3">
        
        <button type="submit" href="#" class="btn btn-block btn-primary">
        Iniciar sesión
        </button>
      </div>
      </form>
      <p class="mb-0">
        <a href="register.php" class="text-center">Registrarse</a>
      </p>
    </div>
    <!-- /.login-card-body -->
  </div>
</div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="../Util/Js/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="../Util/Js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="../Util/Js/adminlte.min.js"></script>

<script src="login.js"></script>

<script src="../Util/Js/toastr.min.js"></script>
</body>
</html>
