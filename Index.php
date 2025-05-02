<?php
  include_once 'Views/Layouts/header.php';
?>

    <title>Productos / ToxicShineBeltran</title>    
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Productos</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <!-- <li class="breadcrumb-item"><a >Home</a></li> -->
              <!-- <li class="breadcrumb-item active"></li> -->
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>
    
    <style>
      .titulo_producto{
        color: #000;
      }
      .titulo_producto:visited{
        color: #000;
      }
      .titulo_producto:focus{
        border-bottom: 1px solid;
      }
      .titulo_producto:hover{
        border-bottom: 1px solid;
      }
      .titulo_producto:active{
        background: #000;
        color: #fff;
      }

      .card {
        margin-bottom: 20px;
        height: auto; /* Asegura que la tarjeta ocupe toda la altura posible */
      }

      .card img {
        height: 150px;  /* Ajusta la altura automáticamente */
        width: 100%;   /* Asegura que la imagen ocupe todo el ancho disponible */
        object-fit: contain;  /* No recorta la imagen */
        object-position: center; /* Centra la imagen dentro del contenedor */
      }

      /* Ajuste para dispositivos móviles */
      @media (max-width: 767px) {
        .card {
          height: auto;  /* Deja que la tarjeta se ajuste al contenido */
        }
        .card img {
          height: 150px; /* Ajusta la imagen a una altura menor en móviles */
        }
      }
      </style>
    <section class="content">

      <!-- Default box -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Productos</h3>          
        </div>
        <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-2">
            <select id="filtro_categoria" class="form-control">
              <option value="">Todas las categorías</option>
            </select>
          </div>
          <div class="col-md-2">
            <input type="number" id="filtro_precio_min" class="form-control" placeholder="Precio mínimo">
          </div>
          <div class="col-md-2">
            <input type="number" id="filtro_precio_max" class="form-control" placeholder="Precio máximo">
          </div>
          <div class="col-md-2">
            <select id="filtro_stock" class="form-control">
              <option value="">Todos</option>
              <option value="con_stock">Con stock</option>
              <option value="sin_stock">Sin stock</option>
            </select>

            </select>
          </div>
          <div class="col-md-2">
            <input type="text" id="filtro_nombre" class="form-control" placeholder="Buscar producto">
          </div>
          <div class="col-md-2">
            <button id="btn_filtrar" class="btn btn-primary btn-block">Filtrar</button>
          </div>
        </div>


          <div id="productos"  class="row">
            <div id="loader_3" class="overlay">
              <i class="fas fa-2x fa-sync-alt fa-spin"></i>
            </div>
          </div>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
        </div>
        <!-- /.card-footer-->
      </div>
      <!-- /.card -->

    </section>
    <?php
    include_once 'Views/Layouts/footer.php';
    ?> 
<script src="index.js"></script>


