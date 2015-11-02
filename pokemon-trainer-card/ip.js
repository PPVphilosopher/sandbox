var ip_data = '';

$.get("http://api.hostip.info/get_html.php", function (data) {
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

    ip_data = text
});