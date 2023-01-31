<h1>Partitura interactiva</h1><br>
<h2>Que hace :</h2>
        <p>La aplicación te permite crear partituras interactivas con las siguientes características:
        <ul>
            <li>Nombre del tema o partitura</li>
            <li>Nombre de las distintas secciones del tema o partitura</li>
            <li>Numero de compases de cada sección</li>
            <li>Contenido de cada compás</li>
        </ul><br>
        <p>Asociar la partitura/tema con un fichero de audio:</p>
        <ul>
            <li>Elegir un audio del disco duro</li>
            <li>Elegir el volumen de reproducción</li>
            <li>Elegir si se reproduce en bucle</li>
            <li>Grabar una secuencia de marcas de compases</li>
            <li>Reproducir el audio viendo el compás en el que se encuentra</li>
            <li>Podemos escuchar el tema musical y ver en que parte de la partitura esta, la app nos marcara este compás</li>
        </ul>
        </p><br>
        <h2>Como lo hace :</h2>
        <p>            Al iniciarse por primera vez la app te advierte que usara <sup> "localStrorage" </sup> para guardar los datos y 
            nos muestra un listado con un solo elemento donde podemos ver:<br>
            Fecha y momento de la creación, nombre en este caso <b>Documento nuevo</b> y el botón para eliminarlo.<br>
            A la derecha en el menú podemos crear un nuevo documento pulsando en :
<div id="mas"><img src="./img/mas36x36.png"></div>
        <p>            Si pulsamos sobre el nombre de un elemento este se abre en modo edición.
            Para volver al listado pulsar en :<p>
<div id="indice"><img src="img/list36x36.png"></div>
        </p>
        <p>            Ahora en el modo edicion podemos cambiar el nombre del Tema y sus secciones, así como elegir cuantos
            compases tiene cada sección.<br>
            Y ahora podemos rellenar la partitura pinchando sobre cada compás y añadiendo a la casilla de texto los
            elementos separados por comas: por ejemplo <code><b>&nbsp;D7,Gm7&nbsp;</b></code> o <code><b>&nbsp;Emaj7,%,Fm7,A7b9"&nbsp;</code></b> o cualquier otra combinación 
            par o impar dependiendo del numerador del tipo de compás 3/4, 4/4 que queramos representar.<br>
            Si usamos la tecla <code>ENTER</code> para guardar el compás, el editor nos mostrara el contenido del siguiente 
            compás hasta llegar al final de la partitura.<br>
            Una vez rellena toda la partitura ya podremos primero elegir un fichero de audio con el botón 
            <code>seleccionar</code> de tipo <b>ogg, mp3 o wav.</b><br>
            Los siguientes pasos son decidir si se reproducirá en bucle y el volumen de escucha.
            Si marcas BUCLE se asignara por defecto como inicio 0 seg y como final el numero de seg que tenga el tema completo.<br>
            Para cambiar esto solo hay que pulsar sobre <code>I</code> inicio o <code>F</code> final durante la reproducción para
            marcar esos instantes.<br>
            Si se desea corregir manualmente el instante la caja de texto se puede sobre-escribir.<br>
            Aquí ya podemos marcar los compases pulsando sobre REC, comenzara el tema y solo tenemos que pulsar
            sobre
            el compás que este sonando a tempo.<br>
            Una vez hecho esto ya tendremos el tema listo y lo podremos reproducir viendo el compás resaltado donde
            vamos. Pudiendo adelantar, retrasar o pausar en cualquier momento.<br>
            Si te salio mal la grabación tendrás que repetirla desde el principio 00:00.<br>
        </p>
<h2>El menú</h2>
<div id="mas"><img src="img/mas36x36.png"></div>
        Si estamos en la pagina inicial crea un Tema nuevo y si estamos en modo edicion una sección.<br><br>
<div id="indice">
            <img src="img/list36x36.png">
        </div>
        Vuelve a la pagina inicial o listado de Temas.<br><br>
<div id="conf">
            <img src="img/config36x36.png">
        </div>
        Abre la página de edición de código, aquí se pueden editar los datos te toda la base, también sirve para
        importar los datos de ficheros JSON o guardarlos en ese mismo formato, bien toda la base o por temas
        independientes<br><br>
<div id="impres">
            <img src="img/impres36x36.png"> </div>
        Imprime solo la partitura, algunos navegadores permiten crear un pdf, como Chrome o Edge.<br><br>
<div id="info"><img src="img/info36x36.png"></div>
        Abre este pequeño manual.<br><br>   
<h2>Sobre el editor de código :</h2>
        La app usa localStorage, una implementación de HTML5 para almacenar la información en texto plano
        representando
        un objeto Json. Por tanto usa la sintaxis Json. Echando un vistazo nos podemos dar cuenta de la estructura
        de los datos.<br><br>

        

        <code class="json">

        [{
        "ID"        :"1471245224900",
        "titulo"    :"Minor swing",
        "grafico"   :[{
                            "ID"    :"1471253759805",
                            "titulo":"Tema",
                            "compas":[
                                        ["Am6"],["%"],["Dm6"],["%"],["E7"],["%"],["Am6"],["A7"]
                                     ]
                     }],
        "audio"     :"Minor Swing .wav",
        "marcas"    :[
                        ["Tema.0",4.4803],["Tema.2",7.6881],["Tema.4",10.888],["Tema.6",14.0481]
                    ]
        }]

        </code>

<p>        Lo mas importante que hay que saber es que si se comete un error de sintaxis, no podrán guardarse los
        cambios corrompiendo la DB y que para las labores de copia de temas completos o secciones es imprescindible cambiar
        el valor de los "ID" ya que se usan como identificadores únicos y representan una marca de tiempo de cuando se
        llevo una acción de modificación en las secciones o de creación en los temas completos.<br><br>
        <h3>Teclas implementadas :</h3>
        <p>
           <code>SPACE</code> &nbsp; &nbsp;      Pausa o pone en marcha el tema musical.<br><br>
             <code>0</code>  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Pone a 00:00 el tema actual.<br><br>
             <code>ENTER</code>   &nbsp; &nbsp; Guarda los valores y pasa al siguiente compás. Al llegar al final cierra el editor de compases.<br><br>
        </p>