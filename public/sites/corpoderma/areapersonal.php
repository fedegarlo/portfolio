<?php

         session_start(); 

$valor = $_POST["valorCampoAEditar"];
$campo = $_POST["campoAEditar"];

$usuario = $_POST["usuarioCorpoderma"];
$password = $_POST["passwordCorpoderma"];
$login = $_POST["loginCorpodermaInput"];
$cerrar = $_POST["cerrarSesionCorpoderma"];

    if ($cerrar) {
      session_destroy();
    } else {
      session_start();
    }

   if ($usuario && $password && $login) {
    if ($usuario === "admin" && $password === "corpo2014") {

      $_SESSION['user'] = $usuario;

    }
   }

  $DBhost = "db346.1and1.es";   // servidor
   $DBuser = "dbo348591756";            // usuario base
   $DBpass = "amansalva";            // contraseña del host
   $DBName = "db348591756";            // nombre de la base de datos
 $DBConn = mysql_connect($DBhost,$DBuser,$DBpass) or die("Error" . mysql_error());
   mysql_select_db($DBName, $DBConn) or die("Error" . mysql_error());

   if ($valor && $campo && !empty($_SESSION['user'])) {
    $sql = "UPDATE `corpoderma_gestor` SET valor='".$valor."' WHERE id ='".$campo."';";
    $resp = mysql_query($sql);
   }

  $sql = "select * from corpoderma_gestor";
  $resp = mysql_query($sql);
  while ($row = mysql_fetch_array($resp)){
    if ($row["campo"] === "globo_cabecera_titular") {
      $globo_cabecera_titular = $row["valor"];
    } else if ($row["campo"] === "globo_cabecera_texto") {
      $globo_cabecera_texto = $row["valor"];
    } if ($row["campo"] === "promocion_1") {
      $promocion_1 = $row["valor"];
    } if ($row["campo"] === "promocion_2") {
      $promocion_2 = $row["valor"];
    } if ($row["campo"] === "promocion_3") {
      $promocion_3 = $row["valor"];
    } if ($row["campo"] === "cabecera_seccion_promos") {
      $cabecera_seccion_promos = $row["valor"];
    } if ($row["campo"] === "horario_entre_semana") {
      $horario_entre_semana = $row["valor"];
    } if ($row["campo"] === "horario_finde") {
      $horario_finde = $row["valor"];
    } if ($row["campo"] === "observaciones_horario_entre_semana") {
      $observaciones_horario_entre_semana = $row["valor"];
    } if ($row["campo"] === "observaciones_horario_finde") {
      $observaciones_horario_finde = $row["valor"];
    } if ($row["campo"] === "datos_contacto_direccion") {
      $datos_contacto_direccion = $row["valor"];
    } if ($row["campo"] === "datos_contacto_telefonos") {
      $datos_contacto_telefonos = $row["valor"];
    }         
  }

?>
<!DOCTYPE html>
<html lang="es" class="no-touch">
<head>
<title>Corpo Derma. Láser Alejandrita.</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="Description" content="Somos un centro de depilación, formado por profesionales sanitarios con mas de 7 años de experiencia, que junto con la tecnología mas avanzada del mercado (Láser Alejandrita de Candela), y un asesoramiento médico, te garantizan la máxima eficacia." />
<meta name="keywords" content="clinica,laser,alejandrita,murcia,depilacion" >


<!-- Le styles -->
<link rel="shortcut icon" href="ico/favicon.png">
<link href="css/bootstrap3.css" rel="stylesheet">
<link href="css/docs3.css" rel="stylesheet">
<link href="css/prettify.css" rel="stylesheet">
<link href="css/social-buttons.css" rel="stylesheet">
<link rel="stylesheet" href="css/validationEngine.jquery.css" type="text/css"/>

<link href="logo_bg2.png" rel="apple-touch-startup-image" />
<link href="apple-touch-icon-iphone.png" rel="apple-touch-icon-precomposed" /> 
<link rel="apple-touch-icon" href="apple-touch-icon-iphone.png" />
<link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-ipad.png" />
<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-iphone4.png" />

</head>

<body data-twttr-rendered="true" class="grisecito">
<div class="container bs-docs-container">
  <div class="row">

    <?php 
    echo '<div class="col-md-3 ';
      if(!empty($_SESSION['user']) && empty($cerrar)) {
            echo 'hidden';
          }
    echo '">';

    
    ?>
      <h2 class="titularGestor">Gestor de contenidos de Corpoderma.es</h2>
        <div class="bs-docs-section separadorArriba">
        <form class="" name="loginCorpoderma" action="areapersonal.php" method="post">
            <div class="col-lg-12">
              <div class="input-group separadorAbajo">
                <label class="input-group-addon">Usuario</label>
                <input type="text" class="form-control" name="usuarioCorpoderma" placeholder="Usuario" />
              </div>
              <div class="input-group separadorAbajo">
                <label class="input-group-addon">Password</label>
                 <input type="password" class="form-control" name="passwordCorpoderma" placeholder="Password" />
               </div>
               <div class="input-group separadorAbajo">
                  <button class="btn btn-default" type="submit" value="Submit">Entrar</button>             
                <input type="hidden" class="form-control" name="loginCorpodermaInput" value="login"/>
              </div>
              </div>          
            </div>
          </form>
        </div>
    <?php echo '<div class="col-md-3 ';
      if(empty($_SESSION['user']) || $cerrar === "cerrarSesion") {
            echo 'hidden';
          }
    echo '">';
    ?>
      <h2 class="titularGestor">Gestor de contenidos de Corpoderma.es</h2>
        <div class="bs-docs-section separadorArriba">
        <form class="" name="loginCorpoderma" action="areapersonal.php" method="post">
            <div class="col-lg-12">
               <div class="input-group separadorAbajo">
                  <button class="btn btn-default" type="submit" value="Submit">Cerrar sesión</button>              
                <input type="hidden" class="form-control" name="cerrarSesionCorpoderma" value="cerrarSesion"/>
              </div>
              </div>          
            </div>
          </form>
        </div>
    <?php echo '<div class="col-md-9 separadorAbajoGrande ';
          if(empty($_SESSION['user']) || $cerrar === "cerrarSesion") {
            echo 'hidden';
          }
          echo '" role="main">';?>
      <div class="bs-docs-section separadorArriba">
      <?php
      $sql = "select * from corpoderma_gestor";
        $resp = mysql_query($sql);
        while ($row = mysql_fetch_array($resp)){
          echo '<form class="" name="gestorCampo'.$row["id"].'" action="areapersonal.php" method="post">
          <div class="col-lg-9">
            <div class="input-group separadorAbajo">';
            echo '<label class="input-group-addon">'.$row["descripcion_campo"].'</label>';
        echo '<input type="text" class="form-control" name="valorCampoAEditar" placeholder="'.$row["valor"].'" />';
        echo '<input type="hidden" class="form-control" name="campoAEditar" value="'.$row["id"].'" />';
        echo '<span class="input-group-btn">
                <button class="btn btn-default" type="submit" value="Submit">Editar</button>
              </span>
              '.$row2["valor"].'
            </div>          
          </div>
        </form>';
        }

        /*echo '<form action="subir.php" method="post" enctype="multipart/form-data">
          <div class="col-lg-9">
            <div class="input-group separadorAbajo">
              <label class="input-group-addon">Imagen (1.jpg, 2.jpg, 3.jpg, 4.jpg)</label> 
              <input name="file" type="file">
              <span class="input-group-btn">
                <button class="btn btn-default" type="submit" value="Enviar">Enviar</button>
              </span>
            </div>
          </div>
          </form> ';
        echo '<form action="subirTarifas.php" method="post" enctype="multipart/form-data">
          <div class="col-lg-9">
            <div class="input-group separadorAbajo">
              <label class="input-group-addon">Tarifas (tarifas.pdf)</label> 
              <input name="file" type="file">
              <span class="input-group-btn">
                <button class="btn btn-default" type="submit" value="Enviar">Enviar</button>
              </span>
            </div>
          </div>
          </form> ';*/
          ?>
      </div>
    </div>
  </div>
</div>

    <script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
    <script src="js/jquery-1.7.2.js" type="text/javascript"></script>
    <script src="js/prettify.js"></script>

    <!--<script src="js/jquery.validationEngine-es.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/jquery.validationEngine.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/funciones.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/underscore.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/backbone.js" type="text/javascript" charset="utf-8"></script>-->
    <script src="js/bootstrap.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/bootstrap.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/conditionizr.js" type="text/javascript" charset="utf-8"></script>
    <script>
      conditionizr({
        debug      : true,
        scriptSrc  : 'js/conditionizr/',
        styleSrc   : 'css/conditionizr/',
        ieLessThan : { active: true, version: '9', scripts: true, styles: true, classes: true, customScript: false},
        chrome     : { scripts: true, styles: true, classes: true, customScript: false },
        safari     : { scripts: true, styles: true, classes: true, customScript: false },
        opera      : { scripts: true, styles: true, classes: true, customScript: false },
        firefox    : { scripts: true, styles: true, classes: true, customScript: false },
        ie10       : { scripts: true, styles: true, classes: true, customScript: false },
        ie9        : { scripts: true, styles: true, classes: true, customScript: false },
        ie8        : { scripts: true, styles: true, classes: true, customScript: false },
        ie7        : { scripts: true, styles: true, classes: true, customScript: false },
        ie6        : { scripts: true, styles: true, classes: true, customScript: false },
        retina     : { scripts: true, styles: true, classes: true, customScript: false },
        touch      : { scripts: true, styles: true, classes: true, customScript: false },
        mac        : true,
        win        : true,
        x11        : true,
        linux      : true
      });
    </script>
    <script src="js/bootstrap-alert.js"></script>
    <script src="js/bootstrap-collapse.js"></script>
</body>
</html>