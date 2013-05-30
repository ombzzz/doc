//nota este script requiere jquery, incluirlo en el html por favor antes de incluir render.js

$(document).ready( function(){

	pathArray = window.location.pathname.split( '/' );
	var doc = pathArray[pathArray.length-1];

	$("html").prepend("<link rel=stylesheet type=text/css href=doc.css />" );

	orig = $("body").html();

	var re = /\n\n/;
	var arr = orig.split(re);
	//onsole.log( arr);

	$("body").html("");
	var cant = 0;
	var indiciodetipoencontrado = 0;

	for(var key in arr)
    {
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
		else {
			window.pardef = "stpar";
		}
        renderconbotones( doc, $("div#p"+cant), arr[key] );
    }
	if( ! indiciodetipoencontrado ){
		console.log( "main: seteando pardef stpar (sintipo)" );
		$( "body" ).addClass( "st");
	}
	else {
		console.log( "main: indicio de tipo encontrado! seteando pardef a " + tipobody );
		$( "body" ).addClass( tipobody );
	}

})


//--------------------------------------------------------------------------------------------------------------
// renderconbotones                                                                                  20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function renderconbotones( doc, el, texto ){

	//onsole.log( "renderconbotones llamado para el " + el.id + " texto " + texto );

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
		
	$(el).html( texto );

	var acciones = "<span class=bot id=be>e</span><span class=bot id=bd>d</span><span class=bot id=bi>i</span><span class=bot id=ba>v</span>";

	$(el).html( texto + " " + acciones );
	$(el).find('span.bot').bind('click', function() {
		if( this.id == "be"){
			hacereditable( doc, this.parentNode );
		}
	});

}

//--------------------------------------------------------------------------------------------------------------
// hacereditable                                                                                     20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function hacereditable( doc, el ){
	console.log( "he: haciendo editable " + el.id);
	texto=pedirtextoapersist( doc, el );
	
	$(el).html( "<textarea class=ed>" + texto + "</textarea><span class=ok>ok</span>");
	$( "span.ok").bind( 'click', function() {
		auxx = $(el).find( "textarea" ).val();
		console.log( "he: ok cliqueado en par " + el.id + " texto ahora es " + auxx );
		avisarpersist( doc, el, auxx );
		renderconbotones( doc, el, auxx );
	});

    var ta = $("textarea.ed");
	ta.css( "height", ta.prop("scrollHeight") );
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

	var url = 'persist.php?accion=get&doc=' + doc + '&parnum=' + parnum;
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
// avisarapersist                                                                                    20000101-ob
//
// quehace
//
// 20000101-ob: crea el metodo (min)
//--------------------------------------------------------------------------------------------------------------
function avisarpersist( doc, el, texto ){
	console.log( "aap: php deberia registrar texto " + textoesc + " en par " + parnum );

	var parnum = el.id.substring( 1 );
	var textoesc = texto.replace( "\n", "__n__");
	textoesc = texto.replace( "#", "__s__");
	
	$.ajaxSetup( { "async": false } );
	var result;

	var url = 'persist.php?accion=persist&doc=' + doc + '&parnum=' + parnum + "&partxt=" + textoesc;
	console.log( "aap: llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "aap: ajax volvio " + result["result"] );
}



