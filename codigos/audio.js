function guarda_bucle(ob) {
    RUEDAACORDES[doc_select].bucle = ob.checked;
    document.getElementById('tema').loop = ob.checked;
    guardaLS();
}
function guarda_puntos_bucle(cb) {
    if (!RUEDAACORDES[doc_select].puntosbucle)
        RUEDAACORDES[doc_select].puntosbucle = [0, acorta_n(document.getElementById('tema').duration)];
    var punto = [RUEDAACORDES[doc_select].puntosbucle[0], RUEDAACORDES[doc_select].puntosbucle[1]];
    punto[0] = (cb == 10) ? acorta_n(document.getElementById('tema').currentTime) : punto[0];
    punto[1] = (cb == 11) ? acorta_n(document.getElementById('tema').currentTime) : punto[1];
    punto[0] = (cb == 0) ? Number(document.getElementById('inicio').value) : punto[0];
    punto[1] = (cb == 1) ? Number(document.getElementById('fin').value) : punto[1];
    document.getElementById('inicio').value = punto[0];
    document.getElementById('fin').value = punto[1];
    RUEDAACORDES[doc_select].puntosbucle = [punto[0], punto[1]];
    guardaLS();
}
function para() {
    para_grabacion();
    document.getElementById('tema').pause();
    document.getElementById('tema').currentTime = 0;
    limpia();
}
function reproduce() {
    if (!grabando) {
        if (document.getElementById('tema').paused) {
            document.getElementById('tema').play();
        } else {
            document.getElementById('tema').pause();
        }
    }
}
function limpia() {
    for (var k in RUEDAACORDES[doc_select].marcas) {
        document.getElementById(RUEDAACORDES[doc_select].marcas[k][0]).style.outline = 'none';
    }
}
function graba(ob) {
    if (!RUEDAACORDES[doc_select].audio) return false;
    if (RUEDAACORDES[doc_select].marcas) {
        if (RUEDAACORDES[doc_select].marcas.length > 0) {
            alerta({
                estado: true,
                texto: "Se borrara cualquier version anterior\r  ¿ continuamos ?",
                accion: () => {                   
                    alerta({ estado: false })
                    return false
                }
            })
        }
    }
    ob.style.backgroundColor = '#f99';
    document.getElementById('checkbucle').checked = false;
    document.getElementById('checkbucle').disabled = true;
    document.getElementById('tema').loop = false;
    ob.onclick = para_grabacion;
    document.getElementById('tema').currentTime = 0;
    document.getElementById('tema').play();
    RUEDAACORDES[doc_select].marcas = [];
    grabando = true;
}
function para_grabacion() {
    if (grabando && document.getElementById('tema').currentTime != 0) {
        document.getElementById('tema').currentTime = 0;
        document.getElementById('tema').pause();
        grabando = false;
        guardaLS();
        carga_documento(doc_select);
    }
}
function fade_out() {
    MOTORFADE = setInterval(function () { });
    var t = document.getElementById('tema');
    if (fadeando != false || t.paused) {
        clearInterval(MOTORFADE);
        return false;
    }
    var s = Number(document.getElementById('fade_out').value);
    if (s == false) return false;
    var vi = t.volume;
    var v = acorta_n(t.volume / (s * 10));
    fadeando = true;
    MOTORFADE = setInterval(function () {
        if (t.volume > 0.05 && !t.paused) {
            t.volume -= v;
            //console.log(t.volume);
        } else {
            t.pause();
            t.volume = vi;
            fadeando = false;
            clearInterval(MOTORFADE);
        }
    }, 100);
}
function guarda_fade_out(v) {
    var tm = Number(v);
    document.getElementById('fade_out').value = tm;
    RUEDAACORDES[doc_select].fade_out = tm;
    guardaLS();
}
function elimina_fichero_audio() {
    RUEDAACORDES[doc_select].audio = ''
    guardaLS()
    carga_documento(doc_select)
}

document.addEventListener = ( "keypress",  elEvento => {
    var evento = elEvento || window.event;
    var caracter = evento.charCode || evento.keyCode;
    if (caracter == 32) { //SPACE
        if (document.getElementById('tema').paused) {
            if (!grabando) {

                var playPromise = document.getElementById('tema').play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                    })
                        .catch(error => {
                            // Auto-play was prevented
                            // Show paused UI.
                        });
                }

            } else {
                reproduce();
            }
        } else {
            if (!grabando) {
                document.getElementById('tema').pause();
            } else {
                para();
            }
        }
    }
    if (caracter == 48) { // 0
        if (!grabando) {
            document.getElementById('tema').currentTime = 0;
        }
    }
})