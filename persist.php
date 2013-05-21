<?php

$accion = $_GET["accion"];

if( $accion == "ver" ){
	mostrar($doc);
}


if( $accion == "persist" ){

	$result = array();
	$result["result"]="ok";
	//$result["echotxt"]=$_GET["partxt"];
	//$result["echonum"]=$_GET["parnum"];

	$doc = $_GET["doc"];
	$filename=$doc;
	$partxt = $_GET["partxt"];
	$parnum = $_GET["parnum"];

	$partxt = str_replace( "__n__", "\n", $partxt);
	$docenparrafos = docenparrafos( $doc );

	$docenparrafos[$parnum]=$partxt . "\n";

	if (!$fp = fopen($filename, 'w+')){
		$result["result"] = "no se puede abrir w+ el archivo $fileName";
	}
	else {
		foreach($docenparrafos as $line){
			fwrite($fp, $line . "\n" ); 	
		}
		fclose($fp);
		//mostrardoc( $filename );
	}
	echo json_encode( $result );
	return;
}

//mostrardoc
function mostrardoc( $docx ){
	echo "<pre>";
	$filename=$docx;

	if(!is_writable($filename)){
		echo "El archivo $filename no es writable\n";
		return null;
	}

	$arArchivo = file($filename);
	if( ! $arArchivo ){
		echo "file de $arArchivo fallo\n";
		return null;
	}
	$i=0;

	while ( $i<count($arArchivo) ) {
		$line = $arArchivo[$i];
	 	if ( ! preg_match("/<script/i", $line )) {
			echo $i . ": " . $line;
		}
		else {
			echo $i . ": " . preg_replace("/</", "#", $line);
		}
		$i++;
	}

	echo "<p>ahora doc en parrafos</p>";

	$docenparrafos = docenparrafos( $docx );

	if( $docenparrafos == false ){
		echo "vino vacio docenparrafos\n";
		return;
	}
	foreach( $docenparrafos as $key => $value){
		echo "<p>";
		echo "parrafo $key es: " . preg_replace( "/</", "#", $value ) . "***\n"; 	
	}
	echo "</pre>";
}

//------------------------------------------------------------------------
// docenparrafos                                               20130517-ob
//
// recibe un nombre de archivo, lo abre, toma cada parrafo y lo mete
//  en un array indexado por numero de parrafo;  se define como parrafo
//  toda linea[s] que terminan en un salto de linea y estan separadas 
//    por 1 o mas saltos de linea/fin de archivo
//
// 20130517-ob: crea el metodo (minutascap)
//------------------------------------------------------------------------
function docenparrafos( $docx ){

	$filename=$docx;

	$adevolver = array();

	$arArchivo = file($filename);
	if( ! $arArchivo ){
		echo "file de $arArchivo fallo\n";
		return null;
	}
	
	$i=0;
	$parnum = 0;

	$lines = "";
	while ( $i<count($arArchivo) ) {
		$line = $arArchivo[$i];

		if( $line == "\n" ){
			if( strlen( $lines ) <> 0 ){
				$adevolver[$parnum] = $lines;
				//echo "linea $i fue n parrafo $parnum es \n******\n" . preg_replace( "/</","#", $adevolver[$parnum] ) . "*****\n";
				$parnum++;
				$lines = "";
			}
		}
		else {
			//echo "linea $i no fue n sino --> " . preg_replace("/</","#",$line) . "<--" . "\n";
			$lines = $lines . $line;
		}
		$i++;
	}
	if( strlen($lines) <> 0 ){
		$adevolver[$parnum] = $lines;
		//echo "ultimo parrafo $parnum es \n******\n" . $adevolver[$parnum] . "*****\n";
	}
	return $adevolver;
}
?>
