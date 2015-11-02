function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    var data = xmlhttp.responseText;
    data = data.toString().replace(/ /g, '').trim();
    data = data.split('\n');

    var text = ''
    $.each(data, function (key, val) {
        var x = val.split(':');
        if (x[1] && x[1].indexOf('Unknown') == -1) {
            if (text) text += ',';
            text += x[1];
        }
    });

    return text;
}

var ip_data = myIP();