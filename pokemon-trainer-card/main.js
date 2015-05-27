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
					gender_select.append('<option value="m">male</option>');
					gender_select.prop('disabled', true);
					break;
				default: 
					gender_select.append('<option value="f">Female</option>');
					gender_select.append('<option value="m">male</option>');
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

				$('#select-preview').html('<img src="pic/icon/' + data.picicon + '"/> ' + data.name);
				var button = $('<a href="javascript:void(0)" class="btn btn-info btn-sm pull-right">add</a>').appendTo($('#select-preview'));

				button.on('click', function () {
					//
				});
			});

			$('#select-gender').trigger('change');
		}


		gender_select.selectize();
		form_select.selectize();
	});

	$('#select-gender, #select-form').prop('disabled', true);
	$('#select-pokemon, #select-gender, #select-form').selectize();

});