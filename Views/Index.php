<?php
  include_once "Layouts/General/header.php";
?>

<style>
  .titulo_producto {
    color: #000;
    text-decoration: none;           /* Sin subrayado por defecto */
    transition: color 0.2s ease-in;   /* Transición de color suave */
  }

  .titulo_producto:hover,
  .titulo_producto:focus,
  .titulo_producto:active {
    color: #000;                      /* Siempre negro al interactuar */
    text-decoration: none;           /* Asegura que no se subraye */
    outline: none;                    /* Sin outline por defecto */
  }

  #productos .card {
    margin-bottom: 0;
    height: auto;  
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    background-color: #fff;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }

  #productos .card:hover {
    transform: scale(1.02);                   
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    background-color: #fafafa;                    /* Sutil cambio de fondo */
  }

  /* Imagen */
  .card img {
    height: 150px;
    width: 100%;
    object-fit: contain;
    object-position: center;
    transition: transform 0.2s ease;
  }
  

  /* Cuerpo de la tarjeta */
  .card-body {
    padding: 1rem;
  }

  @media (max-width: 767px) {
    .row.mb-3 {
      display: flex;
      flex-wrap: wrap;
    }

    /* 1) Buscar al 100% */
    .row.mb-3 > div:nth-child(1) {
      order: 1;
      flex: 0 0 100%;
      max-width: 100%;
    }

    /* 2) Categoría (2º) y Stock (5º) al 50% */
    .row.mb-3 > div:nth-child(2),
    .row.mb-3 > div:nth-child(5) {
      order: 2;
      flex: 0 0 50%;
      max-width: 50%;
    }

    /* 3) Precio mínimo (3º) y Precio máximo (4º) al 50% */
    .row.mb-3 > div:nth-child(3),
    .row.mb-3 > div:nth-child(4) {
      order: 3;
      flex: 0 0 50%;
      max-width: 50%;
    }

    .row.mb-3 [class*="col-"] {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }

    .form-control {
      text-align: left !important;
    }

    .form-group label {
      margin-bottom: 0.25rem;
    }
  }
</style>

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



<section class="content">
  <div class="card">
    <div class="card-body">
    
      <!-- fila de filtros -->
      <div class="row mb-3">
        <!-- Buscar producto -->
        <div class="col-12 col-sm-8 col-md-4 mb-2">
          <div class="form-group">
            <label for="filtro_nombre">Buscar producto</label>
            <input
              type="text"
              id="filtro_nombre"
              class="form-control"
              placeholder="e.g. Ceras liquidas"
            >
          </div>
        </div>
      
        <!-- Categoría -->
        <div class="col-12 col-md-2 mb-2">
          <div class="form-group">
            <label for="filtro_categoria">Categoría</label>
            <select id="filtro_categoria" class="form-control">
              <option value="">Todas</option>
              <!-- más categorías -->
            </select>
          </div>
        </div>
      
        <!-- Precio mínimo -->
        <div class="col-6 col-md-2 mb-2">
          <div class="form-group">
            <label for="filtro_precio_min">Precio mínimo</label>
            <input
              type="number"
              id="filtro_precio_min"
              class="form-control"
              placeholder="A partir de..."
              min="0"
            >
          </div>
        </div>
      
        <!-- Precio máximo -->
        <div class="col-6 col-md-2 mb-2">
          <div class="form-group">
            <label for="filtro_precio_max">Precio máximo</label>
            <input
              type="number"
              id="filtro_precio_max"
              class="form-control"
              placeholder="Un maximo de..." 
              min="0"
            >
          </div>
        </div>
      
        <!-- Stock -->
        <div class="col-6 col-md-2 mb-2">
          <div class="form-group">
            <label for="filtro_stock">Disponibilidad</label>
            <select id="filtro_stock" class="form-control">
              <option value="">Todos</option>
              <option value="1">Con stock</option>
              <option value="0">Sin stock</option>
            </select>
          </div>
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
