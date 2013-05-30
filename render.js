//nota este script requiere jquery, incluirlo en el html por favor antes de incluir render.js

$(document).ready( function(){

	$("html").prepend("<link rel=stylesheet type=text/css href=doc.css />" );

	orig = $("body").html();


	var re = /\n\n/;
	var arr = orig.split(re);
	//console.log( arr);

	$("body").html("");
	var cant = 0;
	for(var key in arr)
    {
    	cant++;
 		$("body").append( "<div class=par id=p" + cant + "></div>");
    	//console.log( "key es " + key );
        //console.log( arr[key] );
		if( arr[key].indexOf( "#mtit" ) != -1 ){
			window.pardef = "mpar";
			$( "body" ).addClass( "min");
		}
        renderconbotones( $("div#p"+cant), arr[key] );
    }
})

function renderconbotones( el, texto ){

	//console.log( "renderconbotones llamado para el " + el.id + " texto " + texto );

	texto = texto.replace( "\n", "<br>");
	var found = false;

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
		console.log( "el " + $(el).attr("id") + " par def " + window.pardef );
	}
		
	$(el).html( texto );

	var acciones = "<span class=bot id=be>e</span><span class=bot id=bd>d</span><span class=bot id=bi>i</span><span class=bot id=ba>v</span>";

	$(el).html( texto + " " + acciones );
	$(el).find('span.bot').bind('click', function() {
		if( this.id == "be"){
			hacereditable( this.parentNode );
		}
	});

}
function hacereditable( el ){
	console.log( "haciendo editable " + el.id);
	texto=pedirtextoapersist( el );
	
	//var auxx=$(el).find( "div.txt" ).html();
	//console.log( "contenido es " + auxx);
	//$(el).replaceWith( "<h4>hola</h4");
	//$(el).html( "<div class=ed><textarea class=ed>" + texto + "</textarea><span class=ok>ok</span></div>");
	$(el).html( "<textarea class=ed>" + texto + "</textarea><span class=ok>ok</span>");
	$( "span.ok").bind( 'click', function() {
		auxx = $(el).find( "textarea" ).val();
		console.log( "ok cliqueado en par " + el.id + " texto ahora es " + auxx );
		avisarpersist( el, auxx );
		renderconbotones( el, auxx );
	});

    var ta = $("textarea.ed");
	ta.css( "height", ta.prop("scrollHeight") );
}

function pedirtextoapersist( el ){
	var parnum = el.id.substring( 1 );

	$.ajaxSetup( { "async": false } );
	var result;

	var url = 'persist.php?accion=get&doc=minuta.html&parnum=' + parnum;
	console.log( "llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "ajax volvio " + result["result"] );
	if( result["result"] == "ok" ){
		return  result["txt"];
	}
}

function avisarpersist( el, texto ){
	var parnum = el.id.substring( 1 );
	var textoesc = texto.replace( "\n", "__n__");
	textoesc = texto.replace( "#", "__s__");
	console.log( "php deberia registrar texto " + textoesc + " en par " + parnum );
	
	$.ajaxSetup( { "async": false } );
	var result;

	var url = 'persist.php?accion=persist&doc=minuta.html&parnum=' + parnum + "&partxt=" + textoesc;
	console.log( "llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "ajax volvio " + result["result"] );
}



