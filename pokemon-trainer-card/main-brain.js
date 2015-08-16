$(document).ready(function () {

	$.each(namelist, function (key, val) {
		$('#select-pokemon').append('<option value="' + val.number + '">' + val.number + ' : ' + val.name + '</option>');
	});

	$('#select-pokemon').on('change', function () {

		var select = $(this).val();

		var gender = female_ratio[select];
		var gender_target = $('#select-gender').parent().html(null);
		var gender_select = $('<select id="select-gender"></select>').appendTo(gender_target);

		var form_target = $('#select-form').parent().html(null);
		var form_select = $('<select id="select-form"></select>').appendTo(form_target);

		$('#select-preview').html(null);

		if (select == "") {
			gender_select.append('<option value="">Select gender</option>');
			gender_select.prop('disabled', true);

			form_select.append('<option value="">Select form</option>');
			form_select.prop('disabled', true);
		} else {
			switch (gender) {
				case null:
					gender_select.append('<option value="g">Genderless</option>');
					gender_select.prop('disabled', true);
					break;
				case 100:
					gender_select.append('<option value="f">Female</option>');
					gender_select.prop('disabled', true);
					break;
				case 0:
					gender_select.append('<option value="m">Male</option>');
					gender_select.prop('disabled', true);
					break;
				default:
					gender_select.append('<option value="f">Female</option>');
					gender_select.append('<option value="m">Male</option>');
					break;
			}

			if (varient[select] == null) {
				form_select.append('<option value="n">No form</option>');
				form_select.prop('disabled', true);
			} else {
				$.each(varient[select], function (key, val) {
					form_select.append('<option value="' + key + '">' + val + '</option>');
				});
			}

			$('#select-gender, #select-form').on('change', function () {
				var pokemon = $('#select-pokemon').val() + $('#select-gender').val() + $('#select-form').val();
				var data = pokemon_pic[$('#select-pokemon').val()][$('#select-gender').val()][$('#select-form').val()];

				var preview_pic = '<img src="pic/icon/' + data.picicon + '"/> ' + data.name + ' - ' + $('#select-gender :selected')[0].textContent;
				$('#select-preview').html(preview_pic);
				var button = $('<a href="javascript:void(0)" class="btn btn-info btn-sm pull-right">add</a>').appendTo($('#select-preview'));

				button.on('click', function () {
					var new_pokemon = $('<li class="dd-item"></li>').appendTo($('#selected >ol'));
					var del_button = $('<a href="javascript:void(0)" class="btn btn-danger btn-sm pull-right">delete</a>').appendTo(new_pokemon);
					del_button.on('click', function () {
						new_pokemon.remove();
					});
					new_pokemon.append('<div class="selected-pokemon dd-handle"></div>');
					new_pokemon.find('.selected-pokemon').append(preview_pic);
					new_pokemon.data('code', pokemon);
					$('#select-pokemon')[0].selectize.setValue('', false);
				});
			});

			$('#select-gender').trigger('change');
		}

		gender_select.selectize();
		form_select.selectize();
	});

	$('#badge [type="checkbox"]').on('change', function () {
		var value = parseInt($(this).val());
		loadimage('pic/brain-ribbon/' + ribbon[value].card_url);
	});

	var category = ['Kanto&Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Other', 'Extra', 'Request'];
	$.each(category, function (key, val) {
		$('#select-category').append('<option value="' + val + '">' + val + '</option>');
	});

	$('#select-category').on('change', function () {
		var selected = $(this).val();
		if (selected == "") {
			$('#div-trainer').html(null).addClass('hidden');
		} else {
			var preview_target = $('#div-trainer').html(null).removeClass('hidden');
			$.each(trainer, function (key, val) {
				if (val.keyword.indexOf(selected) > -1) {
					var trainer = $('<img src="pic/trainer-full-resize/' + val.url + '" title="' + val.name + '" />').appendTo(preview_target);
					trainer.on('click', function () {
						$('#div-trainer').addClass('hidden');
						$('#selected-trainer').html(trainer.clone());
						$('#selected-trainer').data({ 'url': val.url, 'key': key });
						$('#selected-trainer-name').html(val.name);
						loadimage('pic/trainer-full/' + val.url);
					});
				}
			});
		}
	});

	$('#selected-trainer').on('click', function () {
		var target = $('#div-trainer');
		if (target.hasClass('hidden')) {
			target.removeClass('hidden');
		} else {
			target.addClass('hidden');
		}
	});

	$('#selected-top').on('click', function () {
		var target = $('#div-top');
		if (target.hasClass('hidden')) {
			target.removeClass('hidden');
		} else {
			target.addClass('hidden');
		}
	});

	$.each(bg_top, function (key, val) {
		var target = $('#div-top');
		var new_top = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" class="img-responsive" />').appendTo(target);
		new_top.on('click', function () {
			var preview = $('#selected-top').html(new_top.clone());
			$('#selected-top').data('code', key);
			target.addClass('hidden');
			loadimage('pic/card/' + val.url);
			loadimage('pic/card/' + val.overlay);
		});
	});

	if ($('#div-top img[title="frontier default 01"]')[0]) $('#div-top img[title="frontier default 01"]').trigger('click');
	else $('#div-top img:first-child').trigger('click');

	$('#selected-bottom').on('click', function () {
		var target = $('#div-bottom');
		if (target.hasClass('hidden')) {
			target.removeClass('hidden');
		} else {
			target.addClass('hidden');
		}
	});

	$.each(bg_bottom, function (key, val) {
		var target = $('#div-bottom');
		var new_bottom = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" class="img-responsive" />').appendTo(target);
		new_bottom.on('click', function () {
			var preview = $('#selected-bottom').html(new_bottom.clone());
			$('#selected-bottom').data('code', key);
			target.addClass('hidden');
			loadimage('pic/card/' + val.url);
		});
	});

	if ($('#div-bottom img[title="frontier default 01"]')[0]) $('#div-bottom img[title="frontier default 01"]').trigger('click');
	else $('#div-bottom img:first-child').trigger('click');

	$('#select-gender, #select-form').prop('disabled', true);
	$('#select-pokemon, #select-gender, #select-form, #select-category').selectize();
	$('#selected').nestable({
        group: 0
    });

    $('#import_button').on('click', function () {
    	var code = decode($('#card-code').val());

    	var data = code.split(',');
    	// 'name,fc,trainer,top,bottom,badge,pokemon'

    	$('#trainer-info [name="name"]').val(data[0]);
    	$('#trainer-info [name="fc"]').val(data[1]);

    	$('#selected-trainer').html('<img src="pic/trainer-full-resize/' + trainer[data[2]].url + '" title="' + data[2] + '" />');
    	$('#selected-trainer-name').html(trainer[data[2]].name);
    	$('#selected-trainer').data({ url: trainer[data[2]].url, key: data[2] });

    	$('#selected-top').html('<img src="pic/card/' + bg_top[data[3]].url_mini + '" title="' + bg_top[data[3]].name + '" />');
    	$('#selected-top').data({ code: data[3] });

    	$('#selected-bottom').html('<img src="pic/card/' + bg_bottom[data[4]].url_mini + '" title="' + bg_bottom[data[4]].name + '" />');
    	$('#selected-bottom').data({ code: data[4] });

    	var badge_get = parseInt(data[5]);
    	for(var i = 1; i <= 4096; i *= 2) {
			$('#badge [value="' + i + '"]').prop('checked', (badge_get | i )== badge_get);
			$('#badge [value="' + i + '"]').trigger('change');
    	}

    	var pokemon_container = $('#selected .dd-list').html(null);
    	var pokemon_get = data[6].match(/.{1,5}/g);
    	$.each(pokemon_get, function (key, val) {
    		var pic = pokemon_pic[val.substr(0, 3)][val.substr(3, 1)][val.substr(4, 1)];
    		var new_pokemon = $('<li class="dd-item"></li>').appendTo(pokemon_container);
    		new_pokemon.append(
    			'<a href="javascript:void(0)" class="btn btn-danger btn-sm pull-right">delete</a>' +
    			'<div class="selected-pokemon dd-handle"><img src="pic/icon/' + pic.picicon + '"> ' + pic.name + ' - ' + ((val.substr(3, 1) == 'f')? 'Female' : ((val.substr(3, 1)) == 'm')? 'Male' : 'Genderless') + '</div>'
    		);
    		new_pokemon.find('.btn-danger').on('click', function () {
    			$(this).closest('li').remove();
    		});
    		new_pokemon.data('code', val);
    	});

    	drawCanvas(code);
    });

    $('#generate_button').on('click', function () {
    	drawCanvas(getCode());
    });

    function drawCanvas (code) {
    	var junk = $('#junk');
    	var c = document.getElementById("cardCanvas");
		var ctx = c.getContext("2d");

		var data = code.split(',');
    	// 'name,fc,trainer,top,bottom,badge,pokemon'

    	junk.append($('<img id="junk-top" src="pic/card/' + bg_top[data[3]].url + '"/>'));
    	ctx.drawImage($('#junk-top')[0], 0, 0);

    	junk.append($('<img id="junk-bottom" src="pic/card/' + bg_bottom[data[4]].url + '"/>'));
    	ctx.drawImage($('#junk-bottom')[0], 0, 240);

    	if (trainer[data[2]]) {
	    	junk.append($('<img id="junk-trainer" src="pic/trainer-full/' + trainer[data[2]].url + '"/>'));
	    	ctx.drawImage($('#junk-trainer')[0], 0, 0);
    	}

    	junk.append($('<img id="junk-overlay" src="pic/card/' + bg_top[data[3]].overlay + '"/>'));
    	ctx.drawImage($('#junk-overlay')[0], 0, 0);

		ctx.font = "18px Tahoma";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(data[0], 10, 27);
		ctx.fillText(data[1], 10, 57);

    	var badge_get = parseInt(data[5]);
    	var count = 0, get = 0, base = 0;
    	for (var i = 1; i <= 4096; i *= 2) {
    		count++;
			if (count == 1) base = i;
    		if ((badge_get | i ) == badge_get) {
    			get++;
    		}
    		if (count == 3) {
    			var pic = 0;
    			switch (get) {
    				case 1: pic = base; break;
    				case 2: pic = base * 2; break;
    				case 3: pic = base * 4; break;
    			}
    			if (pic) {
	    			junk.append($('<img id="junk-badge-' + i + '" src="pic/brain-ribbon/' + ribbon[pic].card_url + '"/>'));
			    	ctx.drawImage($('#junk-badge-' + i + '')[0], 0, 240);
    			}
    			count = 0;
    			get = 0;
    			base = 0;
    		}
    	}

    	var pokemon_coordinate = {
    		0: { x: 16, y: 76 },
    		1: { x: 60, y: 76 },
    		2: { x: 16, y: 114 },
    		3: { x: 60, y: 114 },
    		4: { x: 16, y: 152 },
    		5: { x: 60, y: 152 },
    		6: { x: 10, y: 204 },
    		7: { x: 54, y: 204 },
    		8: { x: 98, y: 204 },
    		9: { x: 142, y: 204 },
    		10: { x: 186, y: 204 },
    		11: { x: 230, y: 204 },
    		12: { x: 274, y: 204 },
    		13: { x: 318, y: 204 },
    	}
    	var pokemon_get = data[6].match(/.{1,5}/g);
    	if (pokemon_get) {
	    	$.each(pokemon_get, function (key, val) {
	    		var pic = pokemon_pic[val.substr(0, 3)][val.substr(3, 1)][val.substr(4, 1)].picicon;
				junk.append($('<img id="junk-pokemon-' + key + '" src="pic/icon/' + pic + '"/>'));
				var w = parseInt(($('#junk-pokemon-' + key + '')[0].naturalWidth - 32) / 2);
				var h = parseInt(($('#junk-pokemon-' + key + '')[0].naturalHeight - 32) / 2);
		    	ctx.drawImage($('#junk-pokemon-' + key + '')[0], pokemon_coordinate[key].x - w, pokemon_coordinate[key].y - h);
	    	});
    	}

    	junk.html(null);

		$('#card-code').val(encode(code));
    }

    function getCode () {
    	var badge = 0;
    	$('#badge input[type="checkbox"]:checked').each(function () {
    		var badge_val = parseInt($(this).val());
    		console.log(badge_val)
    		badge += badge_val;
    	});

    	var pokemon = "";
    	$('#selected .dd-item').each(function () {
    		pokemon += $(this).data('code');
    	});

    	var code = "" +
    		$('#trainer [name="name"]').val() + ',' +
    		$('#trainer [name="fc"]').val() + ',' +
    		$('#selected-trainer').data('key') + ',' +
    		$('#selected-top').data('code') + ',' +
    		$('#selected-bottom').data('code') + ',' +
    		badge + ',' +
    		pokemon;
    	return code;
    }

    function encode(text) {
        if (!text) return text;
        text = text.toString();
        var encode = "";

        var lib_count = 93;
        var lib_align = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ1234567890\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\>\.\/\?\ "
        var lib_shuffle = "\ 8i\,\_\+c\?0A6RZ\]H\:\>a\=J\`T2GlytIQ\-9KgU45Lu\|pSj\#sbh\/\*\!q\(F\@YnB\\N\&Ck3feMPoW\~\.d7\[\;z\^\"D\}\%\<r\)mw\{X\$\'1EOx"

        var random = parseInt(new Date().getTime()) % lib_count;
        $.each(text, function (key, val) {
            var index_align = lib_align.indexOf(val);
            if (index_align > -1) {
                var target_shufle = (index_align + key + random) % lib_count;
                encode += lib_shuffle[target_shufle];
            } else {
                encode += val;
            }
        });
        return '[' + lib_align[random] + encode + ']';
    }

    function decode(text) {
        if (!text) return text;
        text = text.toString();
        if (text.length < 4 || text[0] != '[' || text[text.length - 1] != ']') return text;
        text = text.substr(1, text.length - 2);

        var lib_count = 93;
        var lib_align = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ1234567890\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\>\.\/\?\ "
        var lib_shuffle = "\ 8i\,\_\+c\?0A6RZ\]H\:\>a\=J\`T2GlytIQ\-9KgU45Lu\|pSj\#sbh\/\*\!q\(F\@YnB\\N\&Ck3feMPoW\~\.d7\[\;z\^\"D\}\%\<r\)mw\{X\$\'1EOx"

        var random = lib_align.indexOf(text[0]);
        if (random < 0) return text;
        text = text.substr(1);
        var decode = "";
        $.each(text, function (key, val) {
            var index_shuffle = lib_shuffle.indexOf(val);
            if (index_shuffle > -1) {
                var target_align = (index_shuffle - key - random) % lib_count;
                if (target_align < 0) target_align += lib_count;
                decode += lib_align[target_align];
            } else {
                decode += val;
            }
        });
        return decode;
    }

    function loadimage(url) {
    	var x = new Image();
    	x.src = url;
    	return x;
    }

    function troll () {
    	$('body').html('<img src="/pic/TrollFace.png" style="width:100%; height:100%;">');
    }

    if (troll_on) troll();

});