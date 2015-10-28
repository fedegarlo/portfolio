<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <link rel="shortcut icon" type="image/x-icon" href="favicon.png">
<title>ABECE Centro Cl&iacute;nico de Servicios Logop&eacute;dicos de Murcia</title>
<link rel="stylesheet" type="text/css" 
      href="estilo.css" />
      <SCRIPT LANGUAGE="JavaScript">
<!-- Funcion Javascript para mostrar una pagina de ayuda
function coment(URL) 
{
	day = new Date();
	id = day.getTime();
	eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0, scrollbars=0, location=0, statusbar=0, menubar=0, resizable=0, width=600, height=350, left = 212, top = 184');");
}
//  -->
</script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2414239-13']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</head>
<body><div id="global"><div id="cabecera"><a href="index.html"><img src="img/logo_nuevo.gif" width="360" height="120" /></a></div>
<div id="pestanas"><a href="index.html"><img src="img/inicio_off.jpg" /></a><a href="servicios.html"><img src="img/serv_off.gif" /></a><a href="profesionales.html"><img src="img/prof_off.gif" /></a><a href="cursos2010.html"><img src="img/cursos_off.gif" /></a><img src="img/contact_off.gif" /><a href="localizacion.html"><img src="img/local_off.gif" /></a><a href="trabaja.html"><img src="img/work_off.gif" /></a></div>
<div id="lateral"><br />
  <div id="texto_lateral"><span class="titulo_blanco">Servicios</span><br /><br /><span class="negrochico">Trastornos de la voz: disfonías, nódulos, cordoctomias, edemas de reinker, dicción, impostación de voz, canto...<br /><br /> 
  Tratamientos en dicci&oacute;n para profesionales de la comunicaci&oacute;n.
<br /><br />
Retraso del habla.<br /><br />
Psicomotricidad.<br /><br />
Trastornos del habla: tartamudez, disfemias, dislalias. (Miembro de la Asociaci&oacute;n Nacional de Tartamudez).<br /><br />
Servicio de logopedia bilingüe para todas las edades.<br /><br />
Trastornos específicos del lenguaje.<br /><br />
Trastornos neurológicos: afasias, disfagias, disfasias, disartrias.<br />
<br />
Degluciones atípicas.<br />
<br />
Problemas escolares,dificultades lecto-escritoras.dislexias.<br /><br />
Patología clínica y escolar.<br /><br />
Cursos de formación de logopedas.<br /><br />
Tratamientos con reiki.<br /><br />
Cursos de formación en reiki.<br><br />
Psicología infantil y adultos.<br /><br />
Terapia de pareja.<br /><br />
Terapia familiar.<br /><br />
Tratamiento de desinhibición a través de la dramatización. (Fobias, tartamudez, habilidades sociales...)<br /><br />
  </span>
  <span class="titulo_blanco">Nuestros Cursos</span><br /><br /><span class="negrochico">La formación de los profesionales de la logopedia es una de nuestras preocupaciones. Por ello, dedicamos parte de nuestros esfuerzos a mejorar la formación y actualización profesional de los compañeros de profesión.<br />
Si quieres conocer nuestro calendario de cursos y actividades, <a href="cursos2010.html">pulsa aquí.</a><br />
<br />
  </span><span class="titulo_blanco">Dónde estamos</span><br /><br /><span class="negrochico">Estamos en<br />
Avda. Primo de Rivera, 12, 4ºB
30008 Murcia<br /><br />

T: 968 90 97 78<br />
M: 676 60 16 06
<br /><br />
  </span></div>
</div>
<div id="centro"><img src="img/main5.gif" />
  <div id="articulo"><span class="fecha">En contacto contigo</span><br>
    <span class='titular'>Si quieres hacernos una consulta o exponernos tu problema, puedes hacerlo a trav&eacute;s de este formulario</span><br>
    <br><?
if (!$HTTP_POST_VARS){
?><form method="post" enctype="multipart/form-data" action="contacto.php">
		Tu nombre: <br /><input type="text" name="nombre" size="50"	><br>	
        Tu teléfono / email <br /><input type="text" name="telefono" size="50"	><br>
Consulta: <br />
<textarea name="mensaje" rows="4" cols="50"></textarea><br><br />
<input type="submit" value="Enviar"></form>
<?
}else{
$correo="abece@gmail.com";
$nombre="ABECE";
$asunto="Han dejado un mensaje en la web";
$headers = "Content-type: text/html\r\n" ;
$headers .= "From: $nombre<$correo>\r\n";
$headers .= "Reply-To: $correo<$correo>\r\n";

$nombre=$HTTP_POST_VARS["nombre"];
$telefono=$HTTP_POST_VARS["telefono"];
$mensaje="<html><head><script type='text/javascript'>

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2414239-13']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</head><body><a href='http://www.abece.com'><img border='0' src='http://www.fedesign.es/abece/img/logo_nuevo.gif'></a><br><h2>Han dejado un mensaje en la web</h2>";
$mensaje=$mensaje.$HTTP_POST_VARS["mensaje"];
$mensaje=$mensaje."<br>Datos del remitente:<br>Nombre: ".$nombre."<br>Teléfono/Email: ".$telefono;
$mensaje=$mensaje."<br><br></body></html>";
$mensaje=$mensaje.$mensaje2;
if($nombre!=""&&$mensaje!=""){
			mail($correo, $asunto, $mensaje, $headers);
			echo "Su cosulta ha sido realizada correctamente.<br>En breve nos pondremos en contacto con usted. Muchas gracias."; 
			}else{
			echo "Por favor, revise todos los campos del formulario.<br><a href='contacto.php'>Volver</a>";
			
			}
			
	}
?><div class="coment">También puedes escribirnos a nuestro email: <span class="verde"> info@abece.com</span></br></br></div><br>
</div></div>
<div id="lateral2"><br />
  <center>
    <a href="cursos2010.html"><img src="img/cursos_spot.gif" /></a><BR />
    <BR />
    <img src="img/abece.gif" /><BR />
    <BR />
    <img src="img/planE.gif" /><BR />
    <BR /><a href="http://es.wikipedia.org/wiki/Logopedia" target="_parent"><img src="img/quees.gif" /></a>
  </center>
</div></div>
</body>
</html>
