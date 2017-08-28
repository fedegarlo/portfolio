<? 
$local =  $_FILES['file']['tmp_name']; 

//El tamaño por si lo necesitas 
$tamano = $_FILES['file']['size']; 

//nombre del archivo escogido para subir ..el cual vamos a utlizarlo para nombrar el archivo que quedará en el server FTP 
$remoto = $_FILES['file']['name']; 

$id_ftp = ftp_connect("ftp.fedegarlo.com",21); 
ftp_login ($id_ftp, "u60682305", "AnuskiyFede4ever"); 
ftp_pasv ($id_ftp, false); 
//carpeta donde vamos a deja el archivo 
ftp_chdir ($id_ftp, "/corpoderma/img"); 
if (ftp_put($id_ftp,$remoto,$local,FTP_BINARY)){ 
echo "Subio OK"; 
}else{echo "No subio";} 

ftp_quit($id_ftp);  
?>