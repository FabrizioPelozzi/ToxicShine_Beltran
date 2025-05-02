<?php
class Conexion{
    private $servidor = "localhost";
    private $db = "toxicshinedatabase";
    private $puerto = 3306;
    private $charset = "utf8";
    private $usuario = "root";
    private $contrasena = "";
    public $pdo = null;
    private $atributos = [
        PDO::ATTR_CASE => PDO::CASE_LOWER,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_ORACLE_NULLS => PDO::NULL_EMPTY_STRING,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
    ];
    // PDO::ATTR_CASE => PDO::CASE_LOWER:

    // Este atributo convierte los nombres de las columnas de los resultados de las consultas a minúsculas. Por ejemplo, si la consulta devuelve una columna llamada Nombre, esta se convertirá a nombre cuando sea recuperada.

    // PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION:

    // Este atributo establece el modo de manejo de errores. En este caso, PDO::ERRMODE_EXCEPTION lanza excepciones (PDOException) cuando ocurre un error en lugar de solo emitir advertencias o silenciar los errores.
    // Es una buena práctica utilizar este modo, ya que permite capturar y manejar los errores de manera más robusta.

    // PDO::ATTR_ORACLE_NULLS => PDO::NULL_EMPTY_STRING:

    // Este atributo especifica cómo PDO debe tratar los valores NULL en columnas cuando la base de datos devuelve una cadena vacía. Con PDO::NULL_EMPTY_STRING, si una columna tiene un valor NULL,
    // se convertirá en una cadena vacía ("") en lugar de NULL. Esto es útil en algunas bases de datos que manejan de manera diferente los valores NULL y las cadenas vacías.

    // PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ:

    // Este atributo establece el modo de obtención de los resultados por defecto. En este caso, PDO::FETCH_OBJ devuelve los resultados como objetos en lugar de arreglos asociativos.
    // Por ejemplo, si se obtiene una fila con una columna llamada nombre, se podrá acceder al valor con $resultado->nombre en lugar de $resultado['nombre'].

    function __construct(){
        $this -> pdo = new PDO("mysql:dbname={$this -> db};host={$this -> servidor};port={$this -> puerto};charset={$this -> charset}",
                        $this -> usuario,
                        $this -> contrasena,
                        $this -> atributos);
    }
}