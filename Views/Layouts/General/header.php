<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">


  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../Util/Css/css/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../Util/Css/adminlte.min.css">
  <link rel="stylesheet" href="../Util/Css/toastr.min.css">
  <link rel="stylesheet" href="../Util/Css/datatables.min.css">
  <link rel="stylesheet" href="../Util/Css/sweetalert2.min.css">

  <!-- (desconfigura toda la parte visual de los iconos y las letras) -->
  <!-- <link rel="stylesheet" href="../Util/Css/bootstrap.min.css">  -->
  <!-- archiov css para todos los archivos -->
  <!-- <link rel="stylesheet" href="../Util/Css/custom.css"> -->
</head>

<style>
  /* Eliminar bordes de la sidebar */
  .main-sidebar {
      border-right: none !important;
  }

  /* Eliminar bordes de cualquier otro contenedor en la sidebar */
  .sidebar, .brand-link, .sidebar-menu {
    border: none !important;
  }
 
    /* Todos los dropdowns del navbar ocuparán el 100% de ancho y se posicionarán a la izquierda */
  .navbar .dropdown-menu {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
  
 /* Centrar dropdown bajo su botón */
  .dropdown-menu-center {
    position: absolute !important;
    top: calc(100% + 0.5rem) !important;  /* un pequeño gap bajo el botón */
    left: 50% !important;                  /* punto de anclaje al 50% del contenedor */
    transform: translateX(-50%) !important;/* se desplaza la mitad de su propio ancho */
    right: auto !important;
    width: auto;                           /* se ajusta al contenido */
    min-width: 8rem;                       /* opcional: ancho mínimo */
    border-radius: .25rem;
  }
</style>

<!-- Modal -->
<div class="modal fade" id="modal_datos" role="dialog">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Editar datos personales</h5>
          </div>
          <div class="modal-body">
              <form id="form-datos">
                  <div class="col-sm-12">
                      <div class="form-group">
                          <label for="nombre_mod">Nombres</label>
                          <input type="text" name="nombre_mod" class="form-control" id="nombre_mod" placeholder="Ingrese su nombre">
                      </div>
                  </div>
                  <div class="col-sm-12">
                      <div class="form-group">
                          <label for="apellido_mod">Apellidos</label>
                          <input type="text" name="apellido_mod" class="form-control" id="apellido_mod" placeholder="Ingrese su apellido">
                      </div>
                  </div>
                  <div class="col-sm-12">
                      <div class="form-group">
                          <label for="telefono_mod">Telefono</label>
                          <input type="number" name="telefono_mod" class="form-control" id="telefono_mod" placeholder="Ingrese su N° de telefono">
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                      <button type="submit" class="btn btn-primary">Guardar</button>
                  </div>
              </form>
          </div>
      </div>
    </div>      
</div>

<body class="hold-transition sidebar-mini">
<!-- Site wrapper -->
<div class="wrapper">
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

    
    <!-- Right navbar links -->
    <ul id="menu_superior" class="navbar-nav ml-auto">
      <div id="loader_1" class="overlay">
        <i class="fas fa-2x fa-sync-alt fa-spin"></i>
      </div>    
    </ul>
  </nav>
  <!-- /.navbar -->
  
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="../Views/index.php" class="brand-link" id="brandLink">
    <img src="../Util/img/logo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
    <span class="brand-text font-weight-light">ToxicShine Beltran</span>
    </a>
    
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul id="menu_lateral" class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <div id="loader_2" class="overlay">
            <i class="fas fa-2x fa-sync-alt fa-spin"></i>
          </div>
        </ul>
      </nav>
    </div>
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">