<?php
    include_once "Layouts/General/header.php";
?>

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

<title> Categorias | ToxicShineBeltran</title>
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Categorias</h1> <br>
                <button class="btn btn-success float-end" type="button" data-bs-toggle="modal" data-bs-target="#modal_crear_categoria">Agregar categoria</button>
            </div>
        </div>
    </div>
</section>
<section class="content">
    <div class="card">
        <div class="card-body">
            <table id="categoria" class="table table-hover">
                <thead>
                    <tr>
                        <th>Categoria</th>
                    </tr>
                </thead>
            </table>
            </div>
        <!-- <div class="card-footer">
            Footer
        </div> -->
    </div>
</section>
<?php
    include_once "Layouts/General/footer.php";
?>
<script src="categorias.js"></script>
