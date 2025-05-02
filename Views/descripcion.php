<?php
if (!empty($_GET["id"])&& $_GET["name"]) {
    session_start();
    $_SESSION["product-verification"]=$_GET["id"];
    include_once "Layouts/General/header.php";
    ?>

<style>
.input-cantidad {
    width: 50px !important; /* Ajuste preciso del ancho */
    min-width: 50px !important;
    max-width: 50px !important;
    text-align: center;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: white;
}

.btn-sm {
    font-size: 18px !important; /* Asegura que el tamaño del ícono sea visible */
    width: 35px; /* Tamaño de los botones */
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

#imagen_principal {
  width: 100%;
  max-height: 400px;
  object-fit: contain; /* <- Esto es lo importante */
  border-radius: 10px;
  background-color: #f8f9fa; /* fondo neutro si hay espacio en blanco */
  padding: 10px; /* pequeño padding para que respire */
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.imagen_pasarelas {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  transition: transform 0.2s ease, border 0.2s ease;
}
.imagen_pasarelas:hover {
  transform: scale(1.05);
  border: 1px solid #0d6efd;
}

.btn-agregar {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.input-group .form-control,
.input-group .btn {
  height: 45px; /* Ajusta la altura según tu preferencia */
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.input-group .btn {
  padding: 0 20px; /* Ajusta el espaciado interno para darle más ancho */
  font-size: 1rem;
}
#producto h3 {
  font-size: 1.75rem;
  font-weight: 600;
  display: inline-block;
  margin-right: 8px;
}

.bandera_favorito {
  padding: 4px 8px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
}


#categoria, #precio {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

#precio {
  font-weight: bold;
  color: #0d6efd;
}

#product-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
}






</style>
<title><?php echo $_GET["name"] ?> / ToxicShineBeltran</title>
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2 d-flex justify-content-between align-items-center">
            <!-- Título a la izquierda -->
            <div class="d-flex align-items-center mb-3">
                <a href="javascript:history.back()" class="btn btn-outline-secondary mr-3">
                    <i class="fas fa-arrow-left"></i>
                </a>
                <h1 class="mb-0"><?php echo $_GET["name"] ?></h1>
            </div>
        </div>
    </div><!-- /.container-fluid -->
</section>

    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="card card-solid">
        <div class="card-body">
          <div class="row">
            <div id="imagenes" class="col-12 col-sm-6">
              <div id="loader_3" class="overlay">
                <i class="fas fa-2x fa-sync-alt fa-spin"></i>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <h3 id="producto" class="my-3"></h3>
              <span id="categoria"></span>
              <div id="precio">
              </div>
              <hr>
              <div id="agregar_carrito" class="mt-4">
                
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <nav class="w-100">
              <div class="nav nav-tabs" id="product-tab" role="tablist">
                <a class="nav-item nav-link active" id="product-desc-tab" data-toggle="tab" href="#product-desc" role="tab" aria-controls="product-desc" aria-selected="true">Descripcion</a>
              </div>
            </nav>
            <div class="tab-content p-3" id="nav-tabContent">
              <div class="tab-pane fade show active" id="product-desc" role="tabpanel" aria-labelledby="product-desc-tab"></div>
            </div>
          </div>
        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->

    </section>


<?php
include_once "Layouts/General/footer.php";
}
else {
    header("Location:../index.php");
}
?>
<script src="descripcion.js"></script>

