<?php
  include_once "Layouts/General/header.php";
?>
<title> Administrar Soporte | ToxicShineBeltrán</title>

<section class="content-header">
  <div class="container-fluid">
    <h1>Administrar Peticiones de Soporte</h1><br>
    <div class="row mb-3 align-items-center">
      <div class="col-sm-2">
        <select id="filtro_estado" class="form-select">
          <option value="">Todos los estados</option>
          <option value="pendiente" >Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>
      <div class="col-sm-2">
        <select id="filtro_tipo" class="form-select">
          <option value="">Todas las incidencias</option>
          <option value="restablecer_email">Restablecer email</option>
          <option value="cambio_dni">Cambiar DNI</option>
          <option value="error_pago">Problema con pago</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    </div>
  </div>
</section>

<section class="content">
  <div class="card">
    <div class="card-body">
      <div id="soporte_list" class="row g-4">
        <!-- Aquí se inyectarán las tarjetas -->
      </div>
    </div>
  </div>
</section>

<?php
  include_once "Layouts/General/footer.php";
?>
<script src="admin_soporte.js"></script>
