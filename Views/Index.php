<?php
  include_once "Layouts/General/header.php";
?>

<title>Productos / ToxicShineBeltran</title>    

<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Productos</h1>
      </div>
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right"></ol>
      </div>
    </div>
  </div>
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
    /* Convertimos a flex contenedor y permitimos que envuelva */
    .row.mb-3 {
      display: flex;
      flex-wrap: wrap;
    }

    /* 1) Buscar (1º) siempre primero y al 100% */
    .row.mb-3 > div:nth-child(1) {
      order: 1;
      flex: 0 0 100%;
      max-width: 100%;
    }

    /* 2) Categoría (2º) y Stock (5º) en la segunda “sub-fila” a 50% */
    .row.mb-3 > div:nth-child(2) {
      order: 2;
      flex: 0 0 50%;
      max-width: 50%;
    }
    .row.mb-3 > div:nth-child(5) {
      order: 3;
      flex: 0 0 50%;
      max-width: 50%;
    }

    /* 3) Precio mínimo (3º) y Precio máximo (4º) en la tercera fila a 50% */
    .row.mb-3 > div:nth-child(3) {
      order: 4;
      flex: 0 0 50%;
      max-width: 50%;
    }
    .row.mb-3 > div:nth-child(4) {
      order: 5;
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
</style>

<section class="content">
  <div class="card">
    <div class="card-body">
    
      <!-- fila de filtros -->
      <div class="row mb-3">
        <!-- barra de búsqueda más larga -->
        <div class="col-md-4">
          <input
            type="text"
            id="filtro_nombre"
            class="form-control"
            placeholder="Buscar producto..."
          >
        </div>
        <div class="col-md-2">
          <select id="filtro_categoria" class="form-control">
            <option value="">Todas las categorías</option>
          </select>
        </div>
        <div class="col-md-2">
          <input
            type="number"
            id="filtro_precio_min"
            class="form-control"
            placeholder="Precio mínimo"
            min="0"
          >
        </div>
        <div class="col-md-2">
          <input
            type="number"
            id="filtro_precio_max"
            class="form-control"
            placeholder="Precio máximo"
            min="0"
          >
        </div>
        <div class="col-md-2">
          <select id="filtro_stock" class="form-control">
            <option value="">Todos</option>
            <option value="1">Con stock</option>
            <option value="0">Sin stock</option>
          </select>
        </div>
      </div>
    
      <!-- contenedor de productos y loader -->
      <div id="loader_3" class="overlay text-center">
        <i class="fas fa-2x fa-sync-alt fa-spin"></i>
      </div>
      <div id="productos" class="row"></div>
    
    </div>
  </div>
</section>

<?php
  include_once "Layouts/General/footer.php";
?> 

<script src="index.js"></script>
