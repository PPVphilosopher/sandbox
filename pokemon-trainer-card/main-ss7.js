(function ($) {
    var lib_count = 92;
    var lib_align = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ1234567890\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\>\.\/\?"
    var lib_shuffle = "h\/\*\!q\(F\@YPoW\~\.d7\[\;x8i\,\_\+c\?0AfeMytIQ\-9KgU45Lu\|pSj\#s6RZ\]H\:\>a\=J\`T2Glz\^\"D\}\%\<r\)mw\{X\$\'1EOnB\\N\&Ck3b"

    $.cardmaker = {
        init: function () {
            $.cardmakerPokemon.init();
            $.cardmakerTrainer.init();
            $.cardmakerBackground.init();

            $('#badge [type="checkbox"]').on('change', function () {
                var value = parseInt($(this).val());
                loadimage('pic/badgeSS7/' + badgeSS7[value].card_url);
            });

            $('#import_button').on('click', function () {
                $.cardmaker.importCard();
            });

            $('#generate_button').on('click', function () {
                $.cardmaker.drawCanvas($.cardmaker.getCode());
            });
        },

        drawCanvas: function (code) {
            console.log(code)
            var junk = $('#junk');
            var c = document.getElementById("cardCanvas");
            var ctx = c.getContext("2d");

            var data = code.split(',');
            // 'name,fc,trainer,top,bottom,badge,pokemon,ipdata'

            junk.append($('<img id="junk-top" src="pic/card/' + bg_top[data[3]].url + '"/>'));
            ctx.drawImage($('#junk-top')[0], 0, 0);

            // junk.append($('<img id="junk-bottom" src="pic/card/' + bg_bottom[data[4]].url + '"/>'));
            // ctx.drawImage($('#junk-bottom')[0], 0, 240);

            if (trainer[data[2]]) {
                junk.append($('<img id="junk-trainer" src="pic/trainer-battle-custom/' + trainer[data[2]].url + '"/>'));
                ctx.drawImage($('#junk-trainer')[0], 0, 0);
            }

            junk.append($('<img id="junk-overlay" src="pic/card/d3.png"/>'));
            // junk.append($('<img id="junk-overlay" src="pic/card/' + bg_top[data[3]].overlay + '"/>'));
            ctx.drawImage($('#junk-overlay')[0], 0, 0);

            ctx.font = "18px Tahoma";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(data[0], 10, 27);
            ctx.fillText(data[1], 10, 57);

            var badge_get = parseInt(data[5]);
            for (var i = 1; i <= 4096; i *= 2) {
                if ((badge_get | i ) == badge_get) {
                    junk.append($('<img id="junk-badge-' + i + '" src="pic/badgeSS7/' + badgeSS7[i].card_url + '"/>'));
                    ctx.drawImage($('#junk-badge-' + i + '')[0], 0, 0);
                }
            }

            var pokemon_coordinate = {
                0: { x: 9, y: 150 },
                1: { x: 45, y: 150 },
                2: { x: 81, y: 150 },
                3: { x: 117, y: 150 },
                4: { x: 153, y: 150 },
                5: { x: 189, y: 150 },
                6: { x: 27, y: 180 },
                7: { x: 63, y: 180 },
                8: { x: 99, y: 180 },
                9: { x: 135, y: 180 },
                10: { x: 171, y: 180 },
                11: { x: 207, y: 180 },
                12: { x: 243, y: 180 },
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

            $('#card-code').val($.cardmaker.encode(code));
        },

        getCode: function () {
            var badge = 0;
            $('#badge input[type="checkbox"]:checked').each(function () {
                var badge_val = parseInt($(this).val());
                badge += badge_val;
            });

            var pokemon = "";
            $('#selected .dd-item').each(function () {
                pokemon += $(this).data('code');
            });

            var fc = $('#trainer [name="fc"]').val();
            var new_fc = '';
            $.each(fc, function (key, val) {
                var x = parseInt(val);
                if (x || x == 0) new_fc += x;
            });

            var complete_fc = '';
            $.each(new_fc, function (key, val) {
                if (key && !(key % 4)) complete_fc += '-';
                complete_fc += val;
            });

            $('#trainer [name="fc"]').val(complete_fc);

            var trainer_name = $('#trainer [name="name"]').val();
            trainer_name = trainer_name.replace(/ /g, '_');
            $('#trainer [name="name"]').val(trainer_name);

            var code = "" +
                trainer_name + ',' +
                complete_fc + ',' +
                $('#selected-trainer').data('key') + ',' +
                $('#selected-top').data('code') + ',' +
                '0,' +
                // $('#selected-bottom').data('code') + ',' +
                badge + ',' +
                pokemon;
            return code;
        },

        encode: function (text) {
            if (!text) return text;
            text = text.toString();
            var encode = "";
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
        },

        decode: function (text) {
            if (!text) return text;
            text = text.toString();
            if (text.length < 4 || text[0] != '[' || text[text.length - 1] != ']') return text;
            text = text.substr(1, text.length - 2);
            text = text.replace(/ /g, '');
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

            var location = window.location;
            if (location.toString().indexOf('http') == -1) console.log(decode);

            return decode;
        },

        importCard: function () {
            var code = $.cardmaker.decode($('#card-code').val().trim());

            var data = code.split(',');
            // 'name,fc,trainer,top,bottom,badge,pokemon'

            $('#trainer-info [name="name"]').val(data[0]);
            $('#trainer-info [name="fc"]').val(data[1]);

            $('#selected-trainer').html('<img src="pic/trainer-battle-custom/' + trainer[data[2]].url + '" title="' + data[2] + '" />');
            $('#selected-trainer-name').html(trainer[data[2]].name);
            $('#selected-trainer').data({ url: trainer[data[2]].url, key: data[2] });

            $('#selected-top').html('<img src="pic/card/' + bg_top[data[3]].url_mini + '" title="' + bg_top[data[3]].name + '" />');
            $('#selected-top').data({ code: data[3] });

            // $('#selected-bottom').html('<img src="pic/card/' + bg_bottom[data[4]].url_mini + '" title="' + bg_bottom[data[4]].name + '" />');
            // $('#selected-bottom').data({ code: data[4] });

            var badge_get = parseInt(data[5]);
            for(var i = 1; i <= 4096; i *= 2) {
                $('#badge [value="' + i + '"]').prop('checked', (badge_get | i )== badge_get);
                $('#badge [value="' + i + '"]').trigger('change');
            }

            var pokemon_container = $('#selected .dd-list').html(null);
            var pokemon_get = data[6].match(/.{1,5}/g);
            $.each(pokemon_get || [], function (key, val) {
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

            $.cardmaker.drawCanvas(code);
        },

    }

    $.cardmakerPokemon = {
        init: function () {
            var selectPokemon = $('#select-pokemon');
            $.each(namelist, function (key, val) {
                selectPokemon.append('<option value="' + val.number + '">' + val.number + ' : ' + val.name + '</option>');
            });

            selectPokemon.on('change', function () {
                var select = $(this).val();
                $.cardmakerPokemon.changePokemon(select);
            });

            $('#select-gender, #select-form').prop('disabled', true);
            $('#select-pokemon, #select-gender, #select-form').selectize();
            $('#selected').nestable({
                group: 0
            });
        },

        changePokemon: function (select) {
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
                switch (female_ratio[select]) {
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

                var selectPokemon = $('#select-pokemon');
                $('#select-gender, #select-form').on('change', function () {
                    var pokemon = selectPokemon.val() + $('#select-gender').val() + $('#select-form').val();
                    var data = pokemon_pic[selectPokemon.val()][$('#select-gender').val()][$('#select-form').val()];

                    var preview_pic = '<img src="pic/icon/' + data.picicon + '"/> ' + data.name + ' - ' + $('#select-gender :selected')[0].textContent;
                    $('#select-preview').html(preview_pic);
                    var button = $('<a href="javascript:void(0)" class="btn btn-info btn-sm pull-right">add</a>').appendTo($('#select-preview'));

                    button.on('click', function () {
                        $.cardmakerPokemon.addPokemon(pokemon, preview_pic);
                    });
                });

                $('#select-gender').trigger('change');
            }

            gender_select.selectize();
            form_select.selectize();
        },

        addPokemon: function (pokemon, preview_pic) {
            var selectPokemon = $('#select-pokemon');
            var new_pokemon = $('<li class="dd-item"></li>').appendTo($('#selected >ol'));
            var del_button = $('<a href="javascript:void(0)" class="btn btn-danger btn-sm pull-right">delete</a>').appendTo(new_pokemon);
            del_button.on('click', function () {
                $.cardmakerPokemon.deletePokemon(new_pokemon);
            });
            new_pokemon.append('<div class="selected-pokemon dd-handle"></div>');
            new_pokemon.find('.selected-pokemon').append(preview_pic);
            new_pokemon.data('code', pokemon);
            selectPokemon[0].selectize.setValue('', false);
        },

        deletePokemon: function (target) {
            target.remove();
        },
    }

    $.cardmakerTrainer = {
        init: function () {
            $('#selected-trainer').on('click', function () {
                $('#div-top').addClass('hidden');
                $('#div-trainer').toggleClass('hidden');
            });

            var selectCategory = $('#select-category');
            var category = ['Kanto&Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Other', 'Extra', 'Request'];
            $.each(category, function (key, val) {
                selectCategory.append('<option value="' + val + '">' + val + '</option>');
            });

            selectCategory.on('change', function () { $.cardmakerTrainer.changeCategory($(this).val()); });

            selectCategory.selectize();
        },

        changeCategory: function (category) {
            var preview_target = $('#div-trainer').html(null);

            if (category == "") {
                preview_target.addClass('hidden');
                return null;
            }

            $('#div-top').addClass('hidden');
            preview_target.removeClass('hidden');
            $.each(trainer, function (key, val) {
                if (val.keyword.indexOf(category) > -1) {
                    if (!val.noBattleImage) {
                        var trainer = $('<img src="pic/trainer-battle-custom/' + val.url + '" title="' + val.name + '" />').appendTo(preview_target);
                        trainer.data(val);
                        trainer.on('click', function () { $.cardmakerTrainer.selectTrainer(trainer, key); });
                    }
                }
            });
        },

        selectTrainer: function (trainer, key) {
            var val = trainer.data();
            $('#div-trainer').addClass('hidden');
            $('#selected-trainer').html(trainer.clone());
            $('#selected-trainer').data({ 'url': val.url, 'key': key });
            $('#selected-trainer-name').html(val.name);
            loadimage('pic/trainer-full/' + val.url);
        },
    }

    $.cardmakerBackground = {
        init: function () {
            $.cardmakerBackground.initTop();
            // $.cardmakerBackground.initBottom();
        },

        initTop: function () {
            $('#selected-top').on('click', function () {
                $('#div-top').toggleClass('hidden');
                $('#div-trainer').addClass('hidden');
            });

            $.each(bg_top, function (key, val) {
                var target = $('#div-top');
                var new_top = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" class="img-responsive" />').appendTo(target);
                new_top.data(val);
                new_top.on('click', function () { $.cardmakerBackground.selectBG(new_top, 'top', key); });
            });

            if ($('#div-top img[title="Wifi battle bg"]')[0]) $('#div-top img[title="Wifi battle bg"]').trigger('click');
            else $('#div-top img:first-child').trigger('click');
        },
        /*
        initBottom: function () {
            $('#selected-bottom').on('click', function () { $('#div-bottom').toggleClass('hidden'); });

            $.each(bg_bottom, function (key, val) {
                var target = $('#div-bottom');
                var new_bottom = $('<img src="pic/card/' + val.url_mini + '" title="' + val.name + '" class="img-responsive" />').appendTo(target);
                new_bottom.data(val);
                new_bottom.on('click', function () { $.cardmakerBackground.selectBG(new_top, 'bottom', key); });
            });

            if ($('#div-bottom img[title="SS6 default 01"]')[0]) $('#div-bottom img[title="SS6 default 01"]').trigger('click');
            else $('#div-bottom img:first-child').trigger('click');
        },
        */

        selectBG: function (element, position, key) {
            var allowedPosition = ['top', 'bottom'];
            position = (position || '').toLowerCase().trim();
            if (allowedPosition.indexOf(position) == -1) return false;

            var val = element.data();
            var target = $('#div-' + position);
            var preview = $('#selected-' + position).html(element.clone());
            $('#selected-' + position).data('code', key);
            target.addClass('hidden');
            loadimage('pic/card/' + val.url);
            // loadimage('pic/card/' + val.overlay);
            loadimage('pic/card/d3.png');
        }
    }

    $(document).ready(function () {
        $.cardmaker.init();
    });

}(jQuery));

function loadimage(url) {
    var x = new Image();
    x.src = url;
    return x;
}