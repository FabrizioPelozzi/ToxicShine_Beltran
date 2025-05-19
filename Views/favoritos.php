<?php include_once "Layouts/General/header.php"; ?>

<style>
  .favorito-item {
      transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
      border: 1px solid #dee2e6;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      background-color: #fff;
    }
    
    .favorito-item:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .favorito-item .card-body {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 1rem;
      height: 100%;
    }
    
    .favorito-info {
      flex: 1;
    }
    
    .favorito-img, .producto-img, .card-img-custom {
      width: 100%;
      max-width: 150px;
      height: 150px;
      object-fit: contain;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      background-color: #f8f9fa; /* color de fondo mientras carga */
      display: block;
      transition: transform 0.2s ease-in-out;
      
    }  
    
    .card-header {
      background-color:rgb(247, 207, 87);
      color: #333;
      padding: 0.75rem 1rem;
    }
    
    .card-header h5 {
      margin: 0;
      font-size: 1.1rem;
    }
    
    .card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    @media (max-width: 767px) {
    /* Apila el contenido verticalmente */
    .favorito-item .card-body {
      display: flex;
      flex-direction: column;  /* de fila a columna */
      align-items: stretch;
      gap: 1rem;
    }

    /* Info siempre primero */
    .favorito-item .favorito-info {
      order: 1;
    }

    /* Imagen después de la info */
    .favorito-item .favorito-img {
      order: 2;
      width: 100%;       /* ocupa todo el ancho disponible */
      max-width: none;   /* anula el max-width base */
      height: auto;      /* que respete la proporción */
      margin: 0 auto;    /* centrada si quieres */
    }

    /* El footer con botones queda abajo, fuera de card-body */
  }






</style>


<title>Mis Favoritos | ToxicShineBeltran</title>
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1>Mis Favoritos</h1>
      </div>
    </div>
  </div>
</section>

<div class="row mb-3">
  <div class="container-fluid">
    <div class="col-12 col-md-4">
      <div class="input-group">
        <input
          type="text"
          id="buscar_favoritos"
          class="form-control"
          placeholder="Buscar producto en favoritos…"
        >
      </div>
    </div>
  </div>
</div>
<br>

<section class="content">
  <div class="card">
    <div class="card-body">
      <div id="fav" class="row"></div>
    </div>
  </div>
</section>

<?php include_once "Layouts/General/footer.php"; ?>
<script src="favoritos.js"></script>
