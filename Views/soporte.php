<?php
  include_once "Layouts/General/header.php";
?>
<title> Soporte | ToxicShineBeltrán</title>

<section class="content-header">
  <div class="container-fluid">
    <h1>Centro de Soporte</h1>
    <p>Completa el formulario y te asistiremos a la brevedad.</p>
  </div>
</section>

<section class="content">
  <div class="container-fluid">
    <div class="card shadow-sm">
      <div class="card-body">
        <form id="form-soporte">
          <div class="row gy-3">
            <div class="col-md-6">
              <label for="soporte_email" class="form-label">Email</label>
              <input type="email" id="soporte_email" name="email" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label for="soporte_telefono" class="form-label">Teléfono</label>
              <input type="text" id="soporte_telefono" name="telefono" class="form-control" required>
            </div>

            <div class="col-md-6">
              <label for="soporte_nombre" class="form-label">Nombre</label>
              <input type="text" id="soporte_nombre" name="nombre" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label for="soporte_apellido" class="form-label">Apellido</label>
              <input type="text" id="soporte_apellido" name="apellido" class="form-control" required>
            </div>

            <div class="col-md-6">
              <label for="soporte_dni" class="form-label">DNI</label>
              <input type="text" id="soporte_dni" name="dni" class="form-control" required>
            </div>
            <div class="col-md-6" >
              <label for="soporte_tipo" class="form-label">Tipo de incidencia</label><br>
              <select id="soporte_tipo" name="tipo" class="form-select" required>
                <option value="">-- Selecciona un problema --</option>
                <option value="restablecer_email">He olvidado mi email</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div class="col-12">
              <label for="soporte_descripcion" class="form-label">Descripción</label>
              <textarea id="soporte_descripcion"
                        name="descripcion"
                        class="form-control"
                        rows="4"
                        placeholder="Describe tu problema con el mayor detalle posible…"></textarea>
            </div>
          </div>

          <div class="mt-4 text-end">
            <button type="submit" class="btn btn-primary">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<?php
  include_once "Layouts/General/footer.php";
?>

<script src="soporte.js"></script>