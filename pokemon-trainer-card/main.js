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

	var category = ['Kanto&Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Other', 'Extra'];
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
						$('#selected-trainer').data('url', val.url);
						$('#selected-trainer-name').html(val.name);
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
		var new_top = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" />').appendTo(target);
		new_top.on('click', function () {
			var preview = $('#selected-top').html(new_top.clone());
			$('#selected-top').data('code', key);
			target.addClass('hidden');
		});
	});

	$('#div-top img:first-child').trigger('click');

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
		var new_bottom = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" />').appendTo(target);
		new_bottom.on('click', function () {
			var preview = $('#selected-bottom').html(new_bottom.clone());
			$('#selected-bottom').data('code', key);
			target.addClass('hidden');
		});
	});

	$('#div-bottom img:first-child').trigger('click');

	$('#select-gender, #select-form').prop('disabled', true);
	$('#select-pokemon, #select-gender, #select-form, #select-category').selectize();
	$('#selected').nestable({
        group: 0
    });

    function encode(text) {
        if (!text) return text;
        text = text.toString();
        var encode = "";

        var lib_count = 93;
        var lib_align = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ1234567890\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\>\.\/\?\ "
        var lib_shuffle = "nB\\N\&Ck3feMPoW\~\.d7\[\;z\^\"D\}\%\<r\)mw\{X\$\'1EOx\ 8i\,\_\+c\?0A6RZ\]H\:\>a\=J\`T2GlytIQ\-9KgU45Lu\|pSj\#sbh\/\*\!q\(F\@Y"

        var random = parseInt(new Date().getTime()) % lib_count;
        $.each(text, function (key, val) {
            var index_align = lib_align.indexOf(val);
            console.log(key + ' ' + val + ' ' + index_align)
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
        var lib_shuffle = "nB\\N\&Ck3feMPoW\~\.d7\[\;z\^\"D\}\%\<r\)mw\{X\$\'1EOx\ 8i\,\_\+c\?0A6RZ\]H\:\>a\=J\`T2GlytIQ\-9KgU45Lu\|pSj\#sbh\/\*\!q\(F\@Y"

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

});