<?php
    include_once "Layouts/General/header.php";
?>

<!-- Modal crear categoria -->
<div class="modal fade" id="modal_crear_categoria" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Crear categoria</h5>
            </div>
            <div class="modal-body">
                <form id="form-categoria">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="nombre_categoria">Nombre</label>
                            <input type="text" name="nombre_categoria" class="form-control" id="nombre_categoria" placeholder="Ingrese nombre de la categoria">
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

<!-- Modal editar categoria -->
<div class="modal fade" id="modal_editar_categoria" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar categoria</h5>
            </div>
            <div class="modal-body">
                <form id="form-editar-categoria">
                    <input type="hidden" id="id_categoria_mod" name="id_categoria_mod">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="nombre_categoria_mod">Nombre</label>
                            <input type="text" name="nombre_categoria_mod" class="form-control" id="nombre_categoria_mod" placeholder="Ingrese nombre de la categoria">
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

<title> Categorías | ToxicShineBeltrán</title>
<section class="content-header">
  <div class="container-fluid">
      <h1>Administrar Categorias</h1> <br>
    <div class="row mb-2 align-items-center">
      <!-- Columna izquierda: buscador -->
      <div class="col-12 col-md-6">
        <div class="input-group mb-0">
          <input type="text"
                 id="filtro_categoria"
                 class="form-control"
                 placeholder="Buscar categoría...">
        </div>
      </div>
      <!-- Columna derecha: botón -->
      <div class="col-12 col-md-6 text-md-end mt-2 mt-md-0">
        <button class="btn btn-success"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modal_crear_categoria">
          <i class="fas fa-plus"></i> Agregar categoría
        </button>
      </div>
    </div>
  </div>
</section>




<section class="content">
    <div class="card">
        <div class="card-body">
            <div id="categoria" class="row g-3"></div>
        </div>
    </div>
</section>
<?php
    include_once "Layouts/General/footer.php";
?>
<script src="categorias.js"></script>
