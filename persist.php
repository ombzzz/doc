<?php

$accion = $_GET["accion"];

if( $accion == "commit" ){
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;
	commit( "usrprueba", "msgprueba", $debug );
	return;
}
else if( $accion == "ver" ){
	mostrar($doc);
}

if( $accion == "nuevo" ){

	$doc = $_GET["doc"];
	$tipo = $_GET["tipo"];
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;

	if( $tipo == "minuta" ){
		$tipo = $tipo;//no hay null; en php?
	}
	else {
		$tipo = "sintipo";	
	}

	$file = "$tipo.templ";
	$newfile = "$doc.html";

	if( !copy($file, "docs/$newfile" ) ){
	    echo "error copiando archivo $file a $newfile\n";
		return;
	}
	else {
		commit( $_SERVER["REMOTE_HOST"], "$doc.html: nuevo archivo" );
		$url = "docs/$doc.html";
		header('Location: '. $url );
	}
}	
else if( $accion == "persist" ){

	$result = array();
	$result["result"]="ok";

	$doc = $_GET["doc"];
	$filename=$doc;
	$partxt = $_GET["partxt"];
	$parnum = $_GET["parnum"];
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;

	$partxt = str_replace( "__n__", "\n", $partxt);
	$partxt = str_replace( "__s__", "#", $partxt);

	$docenparrafos = docenparrafos( $doc, $debug );

	if( $debug )
		echo( "<pre>p.p: actualizando $parnum\n</pre>" );

	$docenparrafos[$parnum]=$partxt . "\n";

	ksort($docenparrafos);
	if (!$fp = fopen( "docs/$filename", 'w+')){
		$result["result"] = "no se puede abrir w+ el archivo $fileName";
	}
	else {
		foreach( $docenparrafos as $key => $value){
			if( $debug )
				echo( "<pre>p.p: escribiendo key $key con $value</pre>\n" );

			fwrite($fp, $value . "\n" ); 	
		}
		fclose($fp);
		//mostrardoc( $filename );
	}
	$extracto = preg_replace('/[^A-Za-z 0-9-.]/', '', substr( $partxt, 0, 15 ) );
	commit( $_SERVER["REMOTE_HOST"], "$filename: cambio parrafo $parnum ( $extracto ) " );
	echo json_encode( $result );
	return;
}
else if( $accion == "get" ){

	$result = array();
	$result["result"]="ok";

	$doc = $_GET["doc"];
	$filename=$doc;
	$parnum = $_GET["parnum"];
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;

	$docenparrafos = docenparrafos( $doc, $debug );

	//$result["txt"]=str_replace( "__n__", "\n", $docenparrafos[$parnum] );
	$result["txt"] = utf8_encode( $docenparrafos[$parnum] );

	if( $debug )
		echo "<pre>devolviendo para parrafo $parnum el texto " . $result["txt"] . "</pre>\n";
	
	echo json_encode( $result );
	return;
}
else if( $accion == "getdoc" ){

	$result = array();
	$result["result"]="ok";

	$doc = $_GET["doc"];
	$filename=$doc;
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;

	$docenparrafos = docenparrafos( $doc, $debug );

	foreach ( $docenparrafos as $key => $value) {
		$result["txt"] .= utf8_encode( $value ) . "\n";
	}
	
	if( $debug ){
		echo ("resultado es " . $result["txt"] );
		return;
	}
	echo json_encode( $result );
	return;
}
else if( $accion == "del" ){

	$result = array();
	$result["result"]="ok";

	$doc = $_GET["doc"];
	$filename=$doc;
	$parnum = $_GET["parnum"];
	$debug = $_GET["debug"];
	if( strlen($debug) > 0 ) 
		$debug = 1;
	else $debug = 0;

	$docenparrafos = docenparrafos( $doc, $debug );

	if (!$fp = fopen( "docs/$filename", 'w+')){
		$result["result"] = "no se puede abrir w+ el archivo $fileName";
	}
	else {
		foreach( $docenparrafos as $key => $value ){
			if( $key != $parnum )
				fwrite($fp, $value . "\n" ); 	
		}
		fclose($fp);
	}
	$extracto = preg_replace('/[^A-Za-z 0-9-.]/', '', substr( $docenparrafos[$parnum], 0, 15 ) );
	commit( $_SERVER["REMOTE_HOST"], "$filename: del parrafo $parnum ( $extracto ) " );
	echo json_encode( $result );
	return;
}
if( $accion == "check" ){

	$result = array();
	$result["result"]="ok";
	echo json_encode( $result );
	return;
}	
else {

	echo <<<FINNN
	<div class=notice>
	<p>para crear nuevo documento, <a target=_blank href=http://cad-dms06/appweb/init/doc/persist.php?accion=nuevo&doc=tareas>http://cad-dms04/appweb/init/doc/persist.php?accion=nuevo&doc=tareas</a>
	<p>El tipo es opcional, actualmente solo se soporta minuta.

	<p>Por ejemplo para crear una minuta nueva: <a target=_blank href=http://cad-dms06/appweb/init/doc/persist.php?accion=nuevo&doc=minuta-minimotec&tipo=minuta>http://cad-dms04/appweb/init/doc/persist.php?accion=nuevo&doc=minuta-minimotec&tipo=minuta</a>

	</div><!--notice-->
FINNN;
	return;
}

//--------------------------------------------------------------------------------------------------------------
// mostrar doc                                                                                       20000101-dv
//
// quehace
//
// 20000101-dv: crea el metodo (rq16205)
//--------------------------------------------------------------------------------------------------------------
function mostrardoc( $docx, $debugx ){
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

	$docenparrafos = docenparrafos( $docx, $debugx );

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
function docenparrafos( $docx, $debugx ){

	$filename=$docx;

	$adevolver = array();

	$arArchivo = file( "docs/$filename" );
	if( ! $arArchivo ){
		echo "<pre>file de $arArchivo fallo\n</pre>";
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
				
				if( $debugx )
					echo "<pre>linea $i fue n parrafo $parnum es \n******\n" . preg_replace( "/</","#", $adevolver[$parnum] ) . "*****\n</pre>";
				$parnum++;
				$lines = "";
			}
		}
		else {
			if( $debugx )
				echo "<pre>linea $i no fue n sino --> " . preg_replace("/</","#",$line) . "<--" . "\n</pre>";
			$lines = $lines . $line;
		}
		$i++;
	}
	if( strlen($lines) <> 0 ){
		$adevolver[$parnum] = $lines;
		if( $debugx )
			echo "<pre>ultimo parrafo $parnum es \n******\n" . $adevolver[$parnum] . "*****\n</pre>";
	}
	return $adevolver;
}

//--------------------------------------------------------------------------------------------------------------
// commit                                                                                            20000101-dv
//
// quehace
//
// 20000101-dv: crea el metodo (rq16205)
//--------------------------------------------------------------------------------------------------------------
function commit( $usr = "", $msg = "", $debugx = 0 ){

	if( strlen( $msg ) == 0 )
		$msg = "mejoras";

	if( strlen( $usr ) == 0 )
		$usr = "alguien";
		
	$comando = "\"C:\Program Files\TortoiseHg\hg.exe\" addremove -R c:\desarrollo\aplicaciones_web\appweb\init\doc\docs ";
	if( $debugx )
		echo "ejecutando $comando";
	exec( $comando );

	$comando = "\"C:\Program Files\TortoiseHg\hg.exe\" commit -u $usr -m \"$msg\" -R c:\desarrollo\aplicaciones_web\appweb\init\doc\docs ";
	if( $debugx )
		echo "ejecutando $comando";
	exec( $comando );
	
}

?>
