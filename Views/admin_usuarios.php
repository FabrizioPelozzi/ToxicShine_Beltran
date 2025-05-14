<?php
    include_once "Layouts/General/header.php";
?>

<!-- Modal Editar Email/DNI -->
<div class="modal fade" id="modal_edit_user" tabindex="-1" aria-labelledby="modalEditUserLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form id="form-edit-user">
        <div class="modal-header">
          <h5 class="modal-title" id="modalEditUserLabel">Editar Email y DNI</h5>
        </div>
        <div class="modal-body">
          <input type="hidden" id="id_usuario_mod" name="id_usuario_mod">

          <div class="mb-3">
            <label for="email_mod" class="form-label">Email</label>
            <input type="email" class="form-control" id="email_mod" name="email_mod" required>
          </div>

          <div class="mb-3">
            <label for="dni_mod" class="form-label">DNI</label>
            <input type="text" class="form-control" id="dni_mod" name="dni_mod" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" class="btn btn-primary">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</div>

<title> Administrar usuarios | ToxicShineBeltran</title>
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-3">
                <h1>Administrar Usuarios</h1> <br>

                <!-- 🔍 Buscador por DNI -->
                <div class="input-group mb-3">
                  <input type="text" id="dni_busqueda" class="form-control" placeholder="Ingrese DNI del usuario">
                  <!-- opcional: oculta el botón de buscar -->
                  <button id="buscar_dni" class="btn btn-primary d-none" type="button">Buscar</button>
                </div>
            </div>
        </div>
    </div>
</section>


<section class="content">
  <div class="card">
    <div class="card-body">
      <div id="usuario_list" class="row g-4"></div>
    </div>
  </div>
</section>



<?php
    include_once "Layouts/General/footer.php";
?>
<script src="admin_usuarios.js"></script>
