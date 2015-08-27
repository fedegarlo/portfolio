//ejemplo de uso de Closures o Cerraduras
function crearFuncion(){
	var i = 0;
	var sumar = function() {
		i=i+1;
		return i;
	};
	return sumar;
}
