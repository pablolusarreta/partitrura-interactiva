//const { dialog } = require('@electron/remote')
//const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const { remote, ipcRenderer } = require('electron')
const fs = require('fs')
const claseDocumento = 'partituras1676408804968'
const anade_clase = () => { for (let i in RUEDAACORDES) { RUEDAACORDES[i].clase = claseDocumento; guardaLS() } }
let AMDHMS = (t) => {
    let d = new Date(t);
    let M = Number(d.getMonth()) + 1; let D = Number(d.getDate()); let h = Number(d.getHours());
    let m = Number(d.getMinutes()); let s = Number(d.getSeconds());
    let nm = d.getFullYear() + '.' + ((M < 10) ? '0' + M : M) + '.' + ((D < 10) ? '0' + D : D) + '-' + ((h < 10) ? '0' + h : h) + '.' + ((m < 10) ? '0' + m : m) + '.' + ((s < 10) ? '0' + s : s);
    return nm
}
const cargaJson = () => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Texto plano', extensions: ['json'] }]
    }).then(result => {
        if (!result.canceled) {
            fs.readFile(result.filePaths[0], (err, data) => {
                if (err) {
                    alerta({ estado: true, texto: error, accion: false })
                } else {
                    document.getElementById('consola').value = (data.toString())
                }
            })
        }
    }).catch(err => {
        console.log(err)
    })
}
function guardaJson(n) {
    let d = new Date()
    let nom_fihero = (n == 0) ? AMDHMS(d) : RUEDAACORDES[doc_select].titulo;
    let url = dialog.showSaveDialog({
        properties: ['openFile'],
        filters: [{ name: 'Texto plano', extensions: ['json'] }],
        defaultPath: nom_fihero
    }).then(result => {
        if (!result.canceled) {
            console.log(result.filePath)
            let objeto = (n == 0) ? RUEDAACORDES : JSON.parse(document.getElementById('consola').value);
            fs.writeFile(result.filePath, JSON.stringify(objeto), error => {
                if (error) { alerta({ estado: true, texto: error, accion: false }) }
            })
        }
    }).catch(err => {
        console.log(err)
    })
}
////////////////////////////////////////////////////////////////////////////////
function muestra_ficheros() {
    let txt = document.getElementById('tx_fichero')
    let tema = document.getElementById('tema')
    let txtemp = txt.value
    txt.value = ''
    let url = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'audio', extensions: ['mp3', 'wav', 'ogg'] }, { name: 'Todos los ficheros', extensions: ['*'] }]
    }).then(result => {
        if (!result.canceled) {
            let url = result.filePaths[0]
            let ta = url.split('.')
            let tipo = 'audio/' + (ta[ta.length - 1].toLowerCase())
            let fich = url.toString().split('\\');
            txt.value = fich[(fich.length - 1)];
            txt.title = url
            tema.innerHTML = '<source src="' + url + '" type="' + tipo + '">'
            tema.load()
            RUEDAACORDES[doc_select].audio = url.replace(/\\/g, '/')
            guardaLS();
            carga_documento(doc_select)
        } else {
            txt.value = txtemp
        }
    }).catch(err => {
        console.log(err)
    })
}
/**/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var RUEDAACORDES = [{ ID: String(new Date().getTime()), titulo: 'Documento nuevo', grafico: [{ ID: String(new Date().getTime()), titulo: '', compas: [[''], [''], [''], ['']] }] }]
var RUEDAACORDESCONFIG = { ordenlista: 0 }
//
var doc_select = 0;
var grabando = false;
var MOTORFADE;
var fadeando = false;
var URLaudio = 'audio/';
var EC                                      //gitar.rueda.file
//var URLaudio        = 'http://localhost/JamManStereo/wav/';     //gitar.rueda
function guardaLS() { localStorage.setItem('RUEDAACORDES', JSON.stringify(RUEDAACORDES)) }
function guardaCF() { localStorage.setItem('RUEDAACORDESCONFIG', JSON.stringify(RUEDAACORDESCONFIG)) }
function ordenaTitulo(a, b) { if (a.titulo === b.titulo) { return 0; } else { return (a.titulo < b.titulo) ? -1 : 1; } }
function ordenaCreado(a, b) { if (a.ID === b.ID) { return 0; } else { return (a.ID < b.ID) ? 1 : -1; } }
const orden = [ordenaTitulo, ordenaCreado, 1]
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function inicio(id) {
    EC = document.getElementById('editor_compas')
    //localStorage.removeItem('RUEDAACORDES');
    if (!localStorage.RUEDAACORDESCONFIG) { guardaCF() }
    if (localStorage.RUEDAACORDES) {
        RUEDAACORDES = JSON.parse(localStorage.getItem('RUEDAACORDES'));
        RUEDAACORDESCONFIG = JSON.parse(localStorage.getItem('RUEDAACORDESCONFIG'));
        //anade_clase()
        var S = '';
        //for (var i in RUEDAACORDES) { RUEDAACORDES[i].titulo = RUEDAACORDES[i].titulo.trim() } guardaLS()
        orden[2] = RUEDAACORDESCONFIG.ordenlista
        RUEDAACORDES.sort(orden[orden[2]])
        for (var i in RUEDAACORDES) {
            S += '<div id="' + i + '"><span onclick="carga_documento(this.parentNode.id)">' + formateaTS(RUEDAACORDES[i].ID) + '</span>';
            S += '<span onclick="carga_documento(this.parentNode.id)">' + RUEDAACORDES[i].titulo + '</span>';
            S += '<div onclick="elimina_documento(this)">+</div></div>';
        }
        document.getElementById('fondo_listado').style.display = 'block';
        document.getElementById('listado').innerHTML = S;
        document.getElementById('mas').onclick = crea_documento;
        document.getElementById('mas').title = 'Crear un documento nuevo';
        document.getElementById('audio').style.display = 'none';
        document.getElementById('tema').load();
        document.getElementById('tema').innerHTML = "";
        document.getElementById('tema').style.display = 'none';
        document.getElementById('partituras').innerHTML = '';
    } else {
        guardaLS();
        inicio();
    }
    if (typeof id === 'number') {
        for (var i in RUEDAACORDES) {
            if (RUEDAACORDES[i].ID == id) {
                carga_documento(i)
                return false
            }
        }
    }
}
function copia_portapapeles() {
    document.getElementById('consola').select();
    document.execCommand("copy");

    //document.getElementById('consola').blur();
}
function limpiaconsola() {
    document.getElementById('consola').value = '';
    document.getElementById('consola').blur();
}
function crea_documento() {
    var id = String(new Date().getTime());
    RUEDAACORDES.push({ ID: id, titulo: 'Documento nuevo', grafico: [{ ID: id, titulo: '', compas: [[''], [''], [''], ['']] }] });
    guardaLS();
    inicio(Number(id));

}
function carga_documento(id) {
    document.getElementById('partituras').innerHTML = '';
    doc_select = Number(id);
    document.getElementById('fondo_listado').style.display = 'none';
    document.getElementById('titulo_documento').value = RUEDAACORDES[doc_select].titulo;
    //document.title = RUEDAACORDES[doc_select].titulo;
    document.getElementById('mas').onclick = function () { crea_partitura(true, RUEDAACORDES[doc_select].grafico.length); };
    document.getElementById('mas').title = 'Crear una partitura nueva';
    for (var i in RUEDAACORDES[doc_select].grafico) {
        crea_partitura(false, Number(i));
    }
    if (!RUEDAACORDES[doc_select].bucle) RUEDAACORDES[doc_select].bucle = false;
    if (RUEDAACORDES[doc_select].audio) {
        var ta = RUEDAACORDES[doc_select].audio.split('.');
        var tipo = 'audio/' + (ta[ta.length - 1].toLowerCase());
        var S = '<source src="' + RUEDAACORDES[doc_select].audio + '" type="' + tipo + '"/>';
    }
    document.getElementById('tema').onvolumechange = function () {
        RUEDAACORDES[doc_select].volumen = document.getElementById('tema').volume;
        guardaLS();
    }
    document.getElementById('tema').volume = (Number(RUEDAACORDES[doc_select].volumen)) ? Number(RUEDAACORDES[doc_select].volumen) : 1;
    document.getElementById('tema').loop = eval(RUEDAACORDES[doc_select].bucle);
    document.getElementById('tema').onseeked = para_grabacion;
    document.getElementById('tema').oncanplay = guarda_puntos_bucle;
    document.getElementById('tema').ontimeupdate = function () {
        var tmp = document.getElementById('tema').currentTime;
        for (var i in RUEDAACORDES[doc_select].marcas) {
            var sig = (Number(i) == (RUEDAACORDES[doc_select].marcas.length - 1)) ? document.getElementById('tema').duration : RUEDAACORDES[doc_select].marcas[(Number(i) + 1)][1];
            if (tmp > RUEDAACORDES[doc_select].marcas[i][1] && tmp < sig) {
                limpia();
                for (var k in RUEDAACORDES[doc_select].marcas) {
                    if (RUEDAACORDES[doc_select].marcas[i][0] == RUEDAACORDES[doc_select].marcas[k][0]) {
                        document.getElementById(RUEDAACORDES[doc_select].marcas[i][0]).style.outline = '8px solid rgba(000,000,000,0.5)';
                        break;
                    }
                }
            }
        }
        if (document.getElementById('tema').paused) {
            document.getElementById('boton_play').innerHTML = 'PLAY';
        } else {
            document.getElementById('boton_play').innerHTML = 'PAUSE';
        }
        // B U C L E
        if (RUEDAACORDES[doc_select].bucle) {
            //console.log(document.getElementById('tema').currentTime);
            if (document.getElementById('tema').currentTime > RUEDAACORDES[doc_select].puntosbucle[1])
                document.getElementById('tema').currentTime = RUEDAACORDES[doc_select].puntosbucle[0];
        }
    }
    document.getElementById('tema').innerHTML = S;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CONTROLES
    S = '<table><tr>';
    //1
    S += '<td onclick="reproduce();" id="boton_play">PLAY</td>';
    //2
    S += '<td onclick="para();" id="boton_stop">STOP</td>';
    //3
    S += '<td onclick="graba(this);" id="boton_rec">REC</td>';
    //4
    var tiempo_fade = ((RUEDAACORDES[doc_select].fade_out) ? RUEDAACORDES[doc_select].fade_out : 0);
    S += '<td onclick="fade_out();">FADE-OUT<input id="fade_out" type="text" value="' + tiempo_fade + '"  disabled><br>';
    S += '<input type="range" min="0" max="20" step="0.1" value="' + tiempo_fade + '" onmousemove="guarda_fade_out(this.value)"></td>';
    //5
    var marcado = (RUEDAACORDES[doc_select].bucle == true) ? 'checked' : '';
    S += '<td>BUCLE<input id="checkbucle" type="checkbox" ' + marcado + ' onchange="guarda_bucle(this)"/>';
    S += '<span>In</span><input type="text" value="" id="inicio" onchange="guarda_puntos_bucle(0)">';
    S += '<button title="Marca el inicio del bucle" onclick="guarda_puntos_bucle(10);this.blur()">I</button><br>';
    S += '<span>Out</span> <input type="text" value="" id="fin" onchange="guarda_puntos_bucle(1)">';
    S += '<button title="Marca el final del bucle" onclick="guarda_puntos_bucle(11);this.blur()">F</button>';
    //6
    var fichero = (RUEDAACORDES[doc_select].audio == undefined) ? '' : RUEDAACORDES[doc_select].audio;
    var fich = fichero.split('/');
    S += '</td><td><span onclick="muestra_ficheros()"><span>FICHERO AUDIO</span></span> <br>';
    S += '<input  onclick="muestra_ficheros()" id="tx_fichero"  type="text" value="' + fich[fich.length - 1] + '" '
    S += 'placeholder="No hay fichero seleccionado!" title="' + fichero + '" disabled>'
    if (fichero != '') {
        S += '<div id="eliminar_fich_aud" onclick="elimina_fichero_audio()">+</div>';
    }
    S += '</td></tr></table>';
    // BOTONES EDICION
    var v_zoom = (RUEDAACORDES[doc_select].zoom) ? RUEDAACORDES[doc_select].zoom : 100;
    zoom(v_zoom);
    S += '<button id="codigo_tema" onclick="cargar_tema();" title="Abre este tema en el EDITOR"><div><img src="img/config27x27.png"></div></button>';
    S += '<input id="zoom" type="range" min="50" max="100" onchange="zoom(this.value);" onmousedown="EC.style.display=\'none\'" '
    S += 'onmousemove="zoom(this.value);" value="' + v_zoom + '" title="Zoom partitura" autocomplete="off">';
    document.getElementById('audio').style.display = 'block';
    document.getElementById('tema').style.display = 'block';
    document.getElementById('tema').controls = 'true';
    document.getElementById('controles').innerHTML = S;
}
function zoom(v) {
    //EC.style.display='none'
    let n = Number(v);
    let tp = 80;
    let rel = document.getElementById('partituras').clientHeight / 220;
    //console.log(rel + '-' + n + ' transform: scale(' + (n / 100) + ') - top: ' + (tp - ((100 - n) * rel)) + 'px')
    document.getElementById('titulo_documento').style.transform = 'scale(' + (n / 100) + ')';
    document.getElementById('partituras').style.transform = 'scale(' + (n / 100) + ')';
    document.getElementById('partituras').style.top = (tp - ((100 - n) * rel)) + 'px';

    RUEDAACORDES[doc_select].zoom = n;
    guardaLS();
}
function elimina_documento(Ob) {
    alerta({
        estado: true,
        texto: '¿ Eliminar el elemento [ ' + (Number(Ob.parentNode.id) + 1) + ' ] ?<br><br><span style="font-family:fuente700">' + Ob.parentNode.childNodes[1].innerHTML + '</span>',
        accion: () => {
            RUEDAACORDES.splice(Number(Ob.parentNode.id), 1);
            guardaLS();
            inicio();
            alerta({ estado: false })
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function guarda_titulo_grafico(id, v) {
    for (var i in RUEDAACORDES[doc_select].grafico) {
        if (id == RUEDAACORDES[doc_select].grafico[i].ID) {
            RUEDAACORDES[doc_select].grafico[i].titulo = v.trim();
            break;
        }
    }
    guardaLS();
}
function guarda_titulo(v) {
    RUEDAACORDES[doc_select].titulo = v.trim();
    guardaLS();
}
function elimina_seccion(Ob) {
    var id = Ob.parentNode.parentNode.parentNode.id;
    Ob.parentNode.parentNode.parentNode.parentNode.removeChild(Ob.parentNode.parentNode.parentNode);
    for (var i in RUEDAACORDES[doc_select].grafico) {
        if (id == RUEDAACORDES[doc_select].grafico[i].ID) {
            //console.log(id,i);
            RUEDAACORDES[doc_select].grafico.splice(Number(i), 1);
            guardaLS();
            break;
        }
    }
}
function guarda_grosor_letra(v) {
    RUEDAACORDES[doc_select].grosor_letra = v;
    guardaLS();
    establece_grosor_letras(v);
}
function establece_grosor_letras(v) {

    var celdas = document.getElementsByClassName('celda_compas');
    for (var i in celdas) { if (typeof (celdas[i]) == "object") { celdas[i].style.fontFamily = 'fuente' + v; } }
}
function guarda_compas_grafico(Ob) {
    var id = Ob.parentNode.parentNode.parentNode.id;
    for (var i in RUEDAACORDES[doc_select].grafico) {
        if (id == RUEDAACORDES[doc_select].grafico[i].ID) {
            var comp = RUEDAACORDES[doc_select].grafico[i].compas.length;
            var n_comp = Number(Ob.value);
            if (comp > n_comp) {
                RUEDAACORDES[doc_select].grafico[i].compas.splice(n_comp - comp);
            } else if (comp < n_comp) {
                for (var j = 0; j < (n_comp - comp); j++) {
                    RUEDAACORDES[doc_select].grafico[i].compas.push(['']);
                }

            } else {
                break;
                return false;
            }
            guardaLS();
            Ob.parentNode.parentNode.childNodes[1].innerHTML = crea_compas_grafico(i);
            break;
        }
    }
}
function abre_editor_compas(Ob, k) {
    if (grabando) {
        var marca = (document.getElementById('tema').currentTime > 0.5) ? (document.getElementById('tema').currentTime - 0.4) : document.getElementById('tema').currentTime;
        RUEDAACORDES[doc_select].marcas.push([Ob.id, acorta_n(marca)]);
        limpia();
        document.getElementById(Ob.id).style.outline = '8px solid rgba(000,000,000,0.3)';
    } else {
        var ed = document.getElementById('editor_compas');
        var i = Number((Ob.id).split('.')[1]);
        ed.childNodes[0].value = RUEDAACORDES[doc_select].grafico[k].compas[i];
        ed.childNodes[2].onclick = function () {
            RUEDAACORDES[doc_select].grafico[k].compas[i] = [ed.childNodes[0].value];
            guardaLS();
            document.getElementById('partituras').innerHTML = '';
            carga_documento(doc_select);
            ed.style.display = 'none';
        };
        ed.onkeypress = function (elEvento) {
            var evento = elEvento || window.event;
            var caracter = evento.charCode || evento.keyCode;
            if (caracter == 13) { // ENTER
                ed.childNodes[2].onclick();
                if (i < RUEDAACORDES[doc_select].grafico[k].compas.length - 1) {
                    abre_editor_compas(document.getElementById('.' + (i + 1)), k);
                }
            }
        }
        ed.style.left = (event.clientX - 120) + 'px';
        ed.style.top = (event.clientY - 70) + 'px';
        ed.style.display = 'block';
        ed.childNodes[0].focus();
    }
}
function crea_compas_grafico(k) {
    var st = ['font-size:10px', 'font-size:30px', 'font-size:27px', 'font-size:23px', 'font-size:18px'];
    var stt = '';
    var S = '<tr>';
    var n_comp_lin = 4;
    var n = 3;
    for (var i in RUEDAACORDES[doc_select].grafico[k].compas) {
        var ac = String(RUEDAACORDES[doc_select].grafico[k].compas[i]).split(',');
        S += '<td id="' + crea_id(RUEDAACORDES[doc_select].grafico[k].titulo) + '.' + i + '" onclick="abre_editor_compas(this,' + k + ');">';
        S += '<table><tr style="' + st[ac.length] + '">';
        for (var j in ac) {
            if (ac[j] == '%') {
                stt = ' style="color:#999;"';
            } else if (ac.length == 1) {
                stt = ' style="text-align:left;padding-left:20px;"';
            } else { stt = ''; };
            S += '<td class="celda_compas"' + stt + '>' + ac[j] + '</td>';
        }
        S += '</tr></table><div>' + (Number(i) + 1) + '</div></td>';
        if (i == n) { n += n_comp_lin; S += '</tr><tr>'; }
    }
    S += '</tr>';
    return S;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function edita(t) {
    EC.style.display = 'none'
    document.getElementById('edicion').style.display = 'block';
    //document.getElementById('consola').value = localStorage.getItem('RUEDAACORDES');
    let list = document.getElementsByClassName('lista')
    let tema = document.getElementsByClassName('tema')
    if (t) {
        for (var i in list) { if (i < list.length) { list[i].setAttribute('disabled', 'true'); list[i].style.opacity = '.3' } }
        for (var i in tema) { if (i < tema.length) { tema[i].removeAttribute('disabled'); tema[i].style.opacity = '1' } }
        document.getElementById('consola').value = JSON.stringify(RUEDAACORDES[doc_select]);
    } else {
        for (var i in tema) { if (i < tema.length) { tema[i].setAttribute('disabled', 'true'); tema[i].style.opacity = '.3' } }
        for (var i in list) { if (i < list.length) { list[i].removeAttribute('disabled'); list[i].style.opacity = '1' } }
        document.getElementById('consola').value = localStorage.getItem('RUEDAACORDES');
    }
}
function cargar_tema() { edita(true) }
function actualizaBase() {
    let txt = document.getElementById('consola').value
    if (esJSON(txt)) {
        alerta({
            estado: true,
            texto: "Se sustituira toda la Base de Datos.<br><br>¿ Deseas continuar ?",
            accion: () => {
                var tmp = JSON.parse(txt)
                var error = false
                for (var i in tmp) {
                    if (typeof (tmp[i].titulo) != 'string' || isNaN(Number(tmp[i].ID)) || typeof (tmp[i].grafico) != 'object') {
                        error = true
                    }
                }
                if (error) {
                    alerta({
                        estado: true,
                        texto: '<span style="color:#f00">¡ Error de sintaxis JSON !</span>  JSON no válido',
                        accion: false
                    });
                } else {
                    localStorage.setItem('RUEDAACORDES', document.getElementById('consola').value);
                    document.getElementById('edicion').style.display = 'none';
                    inicio();
                    alerta({ estado: false })
                }
            }
        })
    } else {
        alerta({ estado: true, texto: '<span style="color:#f00">¡¡ ERROR !!</span>  JSON no válido', accion: false })
    }
}
function anade_tema() {
    let txt = document.getElementById('consola').value
    if (esJSON(txt)) {
        alerta({
            estado: true,
            texto: "Se añadira este tema a la Base de Datos.<br><br>¿ Deseas continuar ?",
            accion: () => {
                let ob = JSON.parse(txt)
                ob.ID = String(new Date().getTime())
                RUEDAACORDES.push(ob)
                guardaLS();
                document.getElementById('edicion').style.display = 'none';
                inicio()
                alerta({ estado: false })
            }
        })
    } else {
        alerta({ estado: true, texto: '<span style="color:#f00">¡¡ ERROR !!</span>  JSON no válido', accion: false })
    }
}
function actualiza_tema() {
    let txt = document.getElementById('consola').value
    if (esJSON(txt)) {
        alerta({
            estado: true,
            texto: "Se sustituira este tema.<br><br>¿ Deseas continuar ?",
            accion: () => {
                RUEDAACORDES[doc_select] = JSON.parse(txt)
                guardaLS();
                document.getElementById('edicion').style.display = 'none';
                carga_documento(doc_select)
                alerta({ estado: false })
            }
        })
    } else {
        alerta({ estado: true, texto: '<span style="color:#f00">¡¡ ERROR !!</span>  JSON no válido', accion: false })
    }
}
function esJSON(txt) {
    try {
        JSON.parse(txt);
    } catch (e) {
        return false;
    }
    return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function crea_partitura(n, k) {
    var n_compases = ((n) ? 4 : RUEDAACORDES[doc_select].grafico[k].compas.length);
    var g_letra = (RUEDAACORDES[doc_select].grosor_letra) ? RUEDAACORDES[doc_select].grosor_letra : 100;;
    var id = (n) ? String(new Date().getTime()) : RUEDAACORDES[doc_select].grafico[k].ID;
    if (n) { RUEDAACORDES[doc_select].grafico.push({ ID: id, titulo: '', compas: [[''], [''], [''], ['']] }); guardaLS(); } //
    var ELE = document.createElement('div');
    var S = '<table border="0">';
    S += '<caption><input type="text" value="' + ((n) ? '' : RUEDAACORDES[doc_select].grafico[k].titulo) + '" placeholder="Titulo"';
    S += ' onchange="guarda_titulo_grafico(this.parentNode.parentNode.parentNode.id,this.value)" onfocus="EC.style.display=\'none\'" />';
    if (k == 0) {
        S += '<span>  Grosor letra:  </span>';
        S += '<select onchange="guarda_grosor_letra(this.value)" onfocus="EC.style.display=\'none\'">';
        for (var j = 100; j < 1100; j += 300) { S += '<option ' + ((j == g_letra) ? 'selected' : '') + '>' + j + '</option>'; }
        S += '</select>   ';
    }
    S += '<span>  Compases:  </span>';
    S += '<select onchange="guarda_compas_grafico(this)" onfocus="EC.style.display=\'none\'">';
    for (var j = 4; j < 49; j += 4) { S += '<option ' + ((j == n_compases) ? 'selected' : '') + '>' + j + '</option>'; }
    S += '</select>';
    S += '<div onclick="elimina_seccion(this);EC.style.display=\'none\'">+</div></caption>';
    S += '<tbody>';
    S += crea_compas_grafico(k);
    S += '</tbody></table>';
    ELE.innerHTML = S;
    ELE.id = id;
    document.getElementById('partituras').appendChild(ELE, null);
    establece_grosor_letras(g_letra);
}
function crea_id(tx) {
    var S = '';
    var expreg = /[A-z,0-9]/;
    for (var i in tx) { if (expreg.test(tx[i])) { S += tx[i]; } } return S;
}
function formateaTS(t) {
    var tm = new Date(Number(t));
    return ((tm.getDate() < 10) ? '0' + tm.getDate() : tm.getDate()) + ' ' + (((tm.getMonth() + 1) < 10) ? '0' + (tm.getMonth() + 1) : (tm.getMonth() + 1)) + ' ' + tm.getFullYear() + '&nbsp;&nbsp;<span style="font-size:75%;">' + ((tm.getHours() < 10) ? '0' + tm.getHours() : tm.getHours()) + ' : ' + ((tm.getMinutes() < 10) ? '0' + tm.getMinutes() : tm.getMinutes()) + ' : ' + ((tm.getSeconds() < 10) ? '0' + tm.getSeconds() : tm.getSeconds()) + '</span>';
}
function acorta_n(n) {
    var s = n.toString();
    var as = s.split('.');
    var ss = '';
    var lim = (as[1].length < 5) ? as[1].length : 4;
    for (var i = 0; i < lim; i++) {
        ss += as[1][i];
    }
    return Number(as[0] + '.' + ss);
}
function imprime() {
    document.getElementById('audio').style.display = 'none'; document.getElementById('tema').style.display = 'none';
    window.print();
    document.getElementById('audio').style.display = 'block'; document.getElementById('tema').style.display = 'block';
}
function guarda_config(v) {
    RUEDAACORDESCONFIG.ordenlista = v
    guardaCF()
    inicio('NOID')
}
const alerta = param => {
    let T = document.getElementById('telon'); let A = document.getElementById('alertas')
    if (param.estado) {
        T.style.display = 'block'; A.style.display = 'block';
        A.childNodes[1].innerHTML = param.texto
        if (param.accion) {
            A.childNodes[5].style.display = "block"; A.childNodes[5].onclick = param.accion
        } else { A.childNodes[5].style.display = "none" }

    } else {
        T.style.display = 'none'; A.style.display = 'none';
    }

}
////////////////////////////////////////////////////////////////////////////////
const informacion = () => {
    let ob = document.getElementsByTagName('info')[0]
    let salir = '<div onclick="this.parentNode.style.display=\'none\'">+</div>'
    ob.style.display = 'block'
    fetch('README.md').then(response => response.text())
        .then(data => ob.innerHTML=`${salir}<div>${data}</div>`);

}
////////////////////////////////////////////////////////////////////////////////
window.onafterprint = () => {
    return false;
}
window.onload = inicio
window.onkeypress = e => { if (e.keyCode == 32) { document.getElementById('tema').pause() } }
