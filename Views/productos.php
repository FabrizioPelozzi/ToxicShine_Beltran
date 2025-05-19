<?php
    include_once "Layouts/General/header.php";
?>

<style>

    /* Contenedor de botones de orden */
    .sort-buttons {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1rem;    /* separa todo el grupo del borde izquierdo */
      gap: 0.75rem;         /* espacio uniforme entre los botones */
    }
    
    /* Si quieres margen extra solo a la derecha de cada botón */
    .sort-buttons button {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem; /* para filas múltiples, si hay wrap */
    }
    
    /* Opcional: centrar verticalmente si están dentro de un flex más grande */
    .sort-buttons {
      align-items: center;
    }


    /* En móviles, evitar la expansión horizontal */
    @media (max-width: 767px) {
        .card {
            max-width: 100%;
            margin: 0 10px; /* Asegurar un pequeño margen */
        }

        /* Ajustar la imagen en móviles */
        .card-body img {
            max-width: 100%;
            object-fit: contain;
        }
    }

</style>

<!-- Modal Crear Producto -->
<div class="modal fade" id="modal_crear_producto" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Crear Producto</h5>
                </button>
            </div>
            <div class="modal-body">
                <form id="form-producto" method="POST" enctype="multipart/form-data">
                    <!-- Nombre del Producto -->
                    <div class="mb-3">
                        <label for="nombre_producto" class="form-label">Nombre del Producto</label>
                        <input type="text" name="nombre_producto" class="form-control" id="nombre_producto" placeholder="Ingrese el nombre del producto" required>
                    </div>
                    
                    <!-- Categoría -->
                    <div class="mb-3">
                        <label for="categoria_producto2" class="form-label">Categoría</label>
                        <select name="categoria_producto2" id="categoria_producto2" class="form-select" required>
                            <!-- Opciones se llenan dinámicamente -->
                        </select>
                    </div>
                    
                    <!-- Descripción -->
                    <div class="mb-3">
                        <label for="descripcion_producto" class="form-label">Descripción</label>
                        <textarea name="descripcion_producto" class="form-control" id="descripcion_producto" rows="3" placeholder="Ingrese la descripción del producto" required></textarea>
                    </div>
                    
                    <!-- Precio -->
                    <div class="mb-3">
                        <label for="precio_producto" class="form-label">Precio</label>
                        <input type="number" name="precio_producto" class="form-control" id="precio_producto" placeholder="Ingrese el precio del producto" min="0" step="0.01" required>
                    </div>
                    
                    <!-- Imagen Principal -->
                    <div class="mb-3">
                        <label for="imagen_producto" class="form-label">Imagen Principal</label>
                        <input type="file" name="imagen_producto" class="form-control" id="imagen_producto" accept="image/*" required>
                    </div>
                    
                    <!-- Stock -->
                    <div class="mb-3">
                        <label for="stock_producto" class="form-label">Stock</label>
                        <div class="input-group">
                            <button type="button" class="btn btn-outline-secondary" id="btnDecrementCrear">-</button>
                            <input type="number" name="stock" id="stock_producto" class="form-control" value="0" min="0" required>
                            <button type="button" class="btn btn-outline-secondary" id="btnIncrementCrear">+</button>
                        </div>
                    </div>
                    
                    <!-- Botones -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>      
</div>

<!-- Modal Editar Datos -->
<div class="modal fade" id="modal_modificar_producto" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modificar Producto</h5>
                </button>
            </div>
            <div class="modal-body">
                <form id="form-modificar-producto" method="POST" enctype="multipart/form-data">
                    <!-- ID del Producto (oculto) -->
                    <input type="hidden" name="id_producto_mod" id="id_producto_mod">

                    <!-- Nombre del Producto -->
                    <div class="mb-3">
                        <label for="nombre_producto_mod" class="form-label">Nombre del Producto</label>
                        <input type="text" name="nombre_producto_mod" class="form-control" id="nombre_producto_mod" placeholder="Ingrese el nombre del producto" required>
                    </div>
                    
                    <!-- Categoría -->
                    <div class="mb-3">
                        <label for="categoria_producto" class="form-label">Categoría</label>
                        <select name="categoria_producto" id="categoria_producto" class="form-select" required>
                            <!-- Opciones (se llenan dinámicamente) -->
                        </select>
                    </div>
                    
                    <!-- Descripción -->
                    <div class="mb-3">
                        <label for="descripcion_mod" class="form-label">Descripción</label>
                        <textarea name="descripcion_mod" class="form-control" id="descripcion_mod" rows="3" placeholder="Ingrese la descripción del producto" required></textarea>
                    </div>
                    
                    <!-- Precio -->
                    <div class="mb-3">
                        <label for="precio_venta_mod" class="form-label">Precio</label>
                        <input type="number" name="precio_venta_mod" class="form-control" id="precio_venta_mod" placeholder="Ingrese el precio del producto" min="0" step="0.01" required>
                    </div>
                    
                    <!-- Imagen Principal -->
                    <div class="mb-3">
                        <label for="imagen_principal_mod" class="form-label">Imagen Principal</label>
                        <input type="file" name="imagen_principal_mod" class="form-control" id="imagen_principal_mod">
                        <input type="hidden" name="imagen_actual" id="imagen_actual">
                    </div>
                    
                    <!-- Vista Previa de Imagen Actual -->
                    <div class="mb-3">
                        <label for="imagen_preview" class="form-label">Imagen Actual</label>
                        <div>
                            <img id="imagen_preview" src="" alt="Imagen actual del producto" style="max-width: 100%;">
                        </div>
                    </div>
                    
                    <!-- Stock -->
                    <div class="mb-3">
                        <label for="stock_input" class="form-label">Stock</label>
                        <div class="input-group">
                            <button type="button" class="btn btn-outline-secondary" id="btnDecrement">-</button>
                            <input type="number" name="stock" id="stock_input" class="form-control" value="0" min="0">
                            <button type="button" class="btn btn-outline-secondary" id="btnIncrement">+</button>
                        </div>
                    </div>
                    
                    <!-- Botones -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>      
</div>

<!-- Modal Editar Imágenes -->
<div class="modal fade" id="modal_editar_imagenes" tabindex="-1" role="dialog" aria-labelledby="modalEditarImagenesLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalEditarImagenesLabel">Editar Imágenes</h5>
        </button>
      </div>
      <div class="modal-body">
        <!-- Formulario de Imágenes -->
        <form id="form_editar_imagenes" method="POST" enctype="multipart/form-data">
          <!-- Campo oculto para el id del producto -->
          <input type="hidden" id="productoId" name="productoId" value="">
          <div id="contenedor_imagenes">
              <!-- Se llenará con JS -->
          </div>
          <button type="button" id="btn_agregar_imagen" class="btn btn-primary mt-3">Agregar Más</button>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary" form="form_editar_imagenes">Guardar Cambios</button>
      </div>
    </div>
  </div>
</div>


<title> Productos | ToxicShineBeltran</title>
<section class="content-header">
  <div class="container-fluid">
    <h1 >Administrar Productos</h1>
    <div class="row mb-2 align-items-center mt-3">
      <div class="col-sm-12 col-md-6 mb-2 mb-md-0 ">
        <!-- 1) Buscador -->
        <div class="input-group">
          <input type="text"
                 id="filtro_producto"
                 class="form-control"
                 placeholder="Buscar producto...">
        </div>
      </div>
        <div class="col-12 col-md-6 text-md-end mt-2 mt-md-0">        
        <butto class="btn btn-success"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modal_crear_producto">
          <i class="fas fa-plus"></i> Agregar producto
        </button>
      </div>
    </div>
  </div>
</section>

<div class="d-flex flex-wrap justify-content-start gap-3 mb-3 sort-buttons ps-3">
  <button class="btn btn-outline-primary btn-sm active me-2" data-order="fecha_edicion_desc">
    Edición ↓
  </button>
  <button class="btn btn-outline-primary btn-sm me-2" data-order="fecha_edicion_asc">
    Edición ↑
  </button>
  <button class="btn btn-outline-primary btn-sm me-2" data-order="fecha_creacion_desc">
    Creación ↓
  </button>
  <button class="btn btn-outline-primary btn-sm me-2" data-order="fecha_creacion_asc">
    Creación ↑
  </button>
  <button class="btn btn-outline-primary btn-sm me-2" data-order="nombre_asc">
    Nombre A → Z
  </button>
  <button class="btn btn-outline-primary btn-sm" data-order="nombre_desc">
    Nombre Z → A
  </button>
</div>

<section class="content">
  <div class="card">
    <div class="card-body">
      <div id="productos" class="row g-4"></div>
    </div>
  </div>
</section>




<?php
    include_once "Layouts/General/footer.php";
?>
<script src="productos.js"></script>

