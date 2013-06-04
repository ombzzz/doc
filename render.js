//nota este script requiere jquery, incluirlo en el html por favor antes de incluir render.js

$(document).ready( function(){

	rendereartodo();

})


//--------------------------------------------------------------------------------------------------------------
// rendersinconbotones                                                                               20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function rendersinconbotones( doc, el, texto, sincon ){

	console.log( "rendersinconbotones llamado para el " + el.id + " texto " + texto );

	texto = texto.replace( "\n", "<br>");
	var found = false;

	$(el).removeClass( "mtit mtit2 mpar mfec" );

   	if( texto.indexOf( "#mtit" ) != -1 && texto.indexOf( "#mtit2" ) == -1 ){
   		$(el).addClass( "mtit");
		texto = texto.replace( "#mtit", "");
		found = true;
	}   		

   	if( texto.indexOf( "#mtit2" ) != -1 ){
   		$(el).addClass( "mtit2");
		texto = texto.replace( "#mtit2", "");
		found = true;
	}   		

   	if( texto.indexOf( "#mpar" ) != -1 ){
   		$(el).addClass( "mpar");
		texto = texto.replace( "#mpar", "");
		found = true;
	}   		

   	if( texto.indexOf( "#mfec" ) != -1 ){
   		$(el).addClass( "mfec");
		texto = texto.replace( "#mfec", "");
		found = true;
	}   		

	if( ! found ){
   		$(el).addClass( window.pardef );
		console.log( "rcb: el " + $(el).attr("id") + " par def " + window.pardef );
	}
		
	//console.log( "antes: " + texto );
	texto = marked( texto );
	texto = texto.replace(/<\/?p>/g, "");
	//console.log( "despues: " + texto );
	$(el).html( texto );

	var acciones;
	
	if( sincon ){
		acciones = "<span class=bot id=be>e</span><span class=bot id=bd>d</span><span class=bot id=bi>^</span><span class=bot id=ba>v</span>";
	}
	else {
		acciones = "";
	}

	$(el).html( texto + " " + acciones );
	$(el).find('span.bot').bind('click', function() {
		if( this.id == "be"){
			usuarioquiereeditar( doc, this.parentNode );
		}
		else if( this.id == "bd" ){
			usuarioquiereeliminar( doc, this.parentNode );
		}
		else if( this.id == "ba" ){
			usuarioquiereinsertardespuesde( doc, this.parentNode );
		}
		else if( this.id == "bi" ){
			usuarioquiereinsertarantesde( doc, this.parentNode );
		}
	});

	$(el).hover(
		function () {
		    $(this).children( "span#be, span#bd, span#bi, span#ba" ).addClass( "visible" );
			//$(this).children().show();
		},
		function () {
		    $(this).children( "span#be, span#bd, span#bi, span#ba" ).removeClass( "visible" );
		    //$(this).children().hide();
		}
	);

}

//--------------------------------------------------------------------------------------------------------------
// usuarioquiereditar                                                                                20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function usuarioquiereeditar( doc, el ){
	console.log( "he: haciendo editable " + el.id);
	texto=pedirtextoapersist( doc, el );
	
	$(el).html( "<textarea class=ed>" + texto + "</textarea><span class=ok>ok</span>");
	$(el).find("span.ok").bind( 'click', function() {
		auxx = $(el).find( "textarea" ).val();
		console.log( "he: ok cliqueado en par " + el.id + " texto ahora es " + auxx );
		avisarpersist( doc, el, auxx );
		rendersinconbotones( doc, el, auxx, 1 );
	});

    var ta = $("textarea.ed");
	ta.css( "height", ta.prop("scrollHeight") );
}

//--------------------------------------------------------------------------------------------------------------
// usuarioquiereinsertar                                                                     20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function usuarioquiereinsertar( doc, elx, nuevopar, aod ){
	console.log( "r.uqiad: usuario quiere insertar en " + (nuevopar/1) );
	console.log( "he: haciendo editable " + nuevopar );
	
	if( aod == "a" )
		$(elx).before( "<div class=par id="+"p"+nuevopar + "></div>" );
	else if( aod == "d" ) 
		$(elx).after( "<div class=par id="+"p"+nuevopar + "></div>" );
	else {
		console.log( "r.uqe: aod no recibido" );
		return;
	}
	var selx = "div#" + "p"+nuevopar;
	selx = selx.replace( ".", "\\." );//escape para jquery
	var el = $( selx );

	$(el).html( "<textarea class=ed placeholder=\"nuevo parrafo!\"></textarea><span class=ok>ok</span>");
	$(el).find("span.ok").bind( 'click', function() {
		auxx = $(el).find( "textarea" ).val();
		console.log( "he: ok cliqueado en par " + $(el).attr("id") + " texto ahora es " + auxx );
		avisarpersist( doc, el.get(0), auxx );
		rendereartodo();
		//rendersinconbotones( doc, el.get(0), auxx );
	});
}


//--------------------------------------------------------------------------------------------------------------
// usuarioquiereinsertarantesde                                                                      20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function usuarioquiereinsertarantesde( doc, elx ){
	var nuevopar = (elx.id.substring( 1 )/1) - 0.5;
	usuarioquiereinsertar( doc, elx, nuevopar, "a" )
}

//--------------------------------------------------------------------------------------------------------------
// usuarioquiereinsertardespuesde                                                                      20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function usuarioquiereinsertardespuesde( doc, elx ){
	var nuevopar = (elx.id.substring( 1 )/1) + 0.5;
	usuarioquiereinsertar( doc, elx, nuevopar, "d" )
}

//--------------------------------------------------------------------------------------------------------------
// usuarioquiereeliminar                                                                             20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function usuarioquiereeliminar( doc, el ){
	console.log( "he: eliminando " + el.id);
	borrarpersist( doc, el );
	$(el).hide();
}

//--------------------------------------------------------------------------------------------------------------
// pedirtextoapresist                                                                                20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function pedirtextoapersist( doc, el ){
	var parnum = el.id.substring( 1 );

	$.ajaxSetup( { "async": false } );
	var result;

	var url = '../persist.php?accion=get&doc=' + doc + '&parnum=' + parnum;
	console.log( "ptap: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "ptap: ajax volvio " + result["result"] );
	if( result["result"] == "ok" ){
		return  result["txt"];
	}
}

//--------------------------------------------------------------------------------------------------------------
// borrarpersist                                                                                     20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function borrarpersist( doc, el ){
	var parnum = el.id.substring( 1 );

	$.ajaxSetup( { "async": false } );
	var result;

	var url = '../persist.php?accion=del&doc=' + doc + '&parnum=' + parnum;
	console.log( "ptap: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "ptap: ajax volvio " + result["result"] );
	if( result["result"] == "ok" ){
		return 0;
	}
	else {
		return 1;
	}
}

//--------------------------------------------------------------------------------------------------------------
// avisarapersist                                                                                    20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function avisarpersist( doc, el, texto ){

	var parnum = el.id.substring( 1 );
	var textoesc = texto.replace( "\n", "__n__");
	textoesc = texto.replace( "#", "__s__");

	//console.log( "aap: php deberia registrar texto " + textoesc + " en par " + parnum );
	
	$.ajaxSetup( { "async": false } );
	var result;

	var url = '../persist.php?accion=persist&doc=' + doc + '&parnum=' + parnum + "&partxt=" + textoesc;
	console.log( "aap: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "aap: ajax volvio " + result["result"] );
}


//--------------------------------------------------------------------------------------------------------------
// getdoc                                                                                            20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function getdoc( docx ){

	$.ajaxSetup( { "async": false } );
	var result;

	var url = '../persist.php?accion=getdoc&doc=' + docx;
	console.log( "r.gd: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	return result["txt"];
}


//--------------------------------------------------------------------------------------------------------------
// persistdisponible                                                                                 20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function persistdisponible(){

	$.ajaxSetup( { "async": false } );
	var result;

	var url = '../persist.php?accion=check';
	console.log( "r.pd: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	var ret = 0;
	
	if( result == undefined ){
		ret = 0;
	}
	else {
		if( result["result"] == "ok" )
			ret = 1;
		else
			ret = 0;
	}
	return ret;
}





//--------------------------------------------------------------------------------------------------------------
// renderertodo                                                                                      20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function rendereartodo(){

	marked.setOptions({
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: true,
	  smartLists: true,
	  smartypants: false,
	  langPrefix: 'language-',
	  highlight: function(code, lang) {
		if (lang === 'js') {
		  return highlighter.javascript(code);
		}
		return code;
	  }
	});

	pd = persistdisponible();

	if( pd ){
		console.log( "r.rt: persist disponible, rendereando editable" );
	}
	else {
		console.log( "r.rt: persist no disponible, rendereando no editable" );
	}

	pathArray = window.location.pathname.split( '/' );
	var doc = pathArray[pathArray.length-1];

	orig = getdoc( doc );
	var re = /\n\n/;
	var arr = orig.split(re);

	$("body").html("");

	var cant = 0;
	var indiciodetipoencontrado = 0;

	for( var key in arr )
	{
		if( arr[key].indexOf( "<script" ) == -1 && arr[key].indexOf( "</script" == -1 )){
			cant++;
			$("body").append( "<div class=par id=p" + cant + "></div>");
			//onsole.log( "key es " + key );
			//onsole.log( arr[key] );
			if( arr[key].indexOf( "#mtit" ) != -1 && arr[key].indexOf( "#mtit2" ) == -1 ){
				window.pardef = "mpar";
				console.log( "main: seteando pardef mpar (minuta)" );
				tipobody = "min";
				indiciodetipoencontrado = 1;
			}
			else if( !indiciodetipoencontrado ) {
				window.pardef = "stpar";
			}
			rendersinconbotones( doc, $("div#p"+cant), arr[key], pd );
		}
	}
	if( ! indiciodetipoencontrado ){
		console.log( "main: seteando pardef stpar (sintipo)" );
		$( "body" ).addClass( "st");
	}
	else {
		console.log( "main: indicio de tipo encontrado! seteando pardef a " + tipobody );
		$( "body" ).addClass( tipobody );
	}

	if( pd && window.location.href.indexOf( "nomenu=1" ) == -1 ){
		urln=window.location.href + "?nomenu=1";
		$("body").append( "<div class=naveg><a target=_blank href=http://cad-dms04:8200>repo</a><div class=nota>pasar <a href="+urln+ ">nomenu=1</a> para ocultar</div></div>\n" );
	}
	$("html").prepend("<link rel=stylesheet type=text/css href=../doc.css />" );

}
