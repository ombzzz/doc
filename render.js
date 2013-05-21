//nota este script requiere jquery, incluirlo en el html por favor antes de incluir render.js

$(document).ready( function(){

	$("html").prepend("<link rel=stylesheet type=text/css href=doc.css />" );

	orig = $("body").html();

	$( "body" ).addClass( "min");

	var re = /\n\n/;
	var arr = orig.split(re);
	//console.log( arr);

	$("body").html("");
	var cant = 0;
	for(var key in arr)
    {
    	cant++;
 		$("body").append( "<div id=p" + cant + "></div>");
    	//console.log( "key es " + key );
        //console.log( arr[key] );
        renderconbotones( $("div#p"+cant), arr[key] );
    }
})

function renderconbotones( el, texto ){

	//console.log( "renderconbotones llamado para el " + el.id + " texto " + texto );
	var acciones = "<div class=b><span id=be>e</span><span id=bd>d</span><span id=bi>^</span><span id=ba>v</span></div>";

   	if( texto.indexOf( "#mtit" ) != -1 && texto.indexOf( "#mtit2" ) == -1 ){
   		$(el).addClass( "mtit");
		texto = texto.replace( "#mtit", "");
	}   		

   	if( texto.indexOf( "#mtit2" ) != -1 ){
   		$(el).addClass( "mtit2");
		texto = texto.replace( "#mtit2", "");
	}   		

   	if( texto.indexOf( "#mpar" ) != -1 ){
   		$(el).addClass( "mpar");
		texto = texto.replace( "#mpar", "");
	}   		

   	if( texto.indexOf( "#mfec" ) != -1 ){
   		$(el).addClass( "mfec");
		texto = texto.replace( "#mfec", "");
	}   		

	$(el).html( texto );
	//$(el).html( "<div class=txt>" + texto + "</div>" + acciones + "</div>");
	$(el).find('div.b span').bind('click', function() {
		if( this.id == "be"){
			hacereditable( this.parentNode.parentNode );
		}
	});

}
function hacereditable( el ){
	console.log( "haciendo editable " + el.id);
	var auxx=$(el).find( "div.txt" ).html();
	//console.log( "contenido es " + auxx);
	//$(el).replaceWith( "<h4>hola</h4");
	$(el).html( "<div class=ed><textarea class=ed>" + auxx + "</textarea><span class=ok>ok</span></div>");
	$( "div.ed span.ok").bind( 'click', function() {
		auxx = $(el).find( "textarea" ).val();
		console.log( "ok cliqueado en par " + el.id + " texto ahora es " + auxx );
		avisarpersist( el, auxx );
	});

}

function avisarpersist( el, texto ){
	var parnum = el.id.substring( 1 );
	var textoesc = texto.replace( "\n", "__n__");
	console.log( "php deberia registrar texto " + textoesc + " en par " + parnum );

	$.ajaxSetup( { "async": false } );
	var result;

	var url = 'persist.php?accion=persist&doc=minuta.html&parnum=' + parnum + "&partxt=" + textoesc;
	console.log( "llamando ajax para url " + url );

	$.getJSON( url, function(data) {
		result = data; //orlando: closure!
	});

	console.log( "ajax volvio " + result["result"] );

	renderconbotones( el, texto );
}



