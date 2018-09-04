$(document).ready(function () {


	$('#moeda').change(function () {
		$.ajax({
			//url:'https://fxdone.concore.io/get-taxa/' + $('#moeda').val(),
			url: 'https://fxdone.concore.io/list-taxas/',
			type: 'get',
			success: function (res) {
				console.log(res);
				var compra = res.filter(item => item.atoms.tipoTaxa.value == "Compra");
				var a = $.grep(compra, function (taxa) {
					return taxa.atoms.moeda.atoms.codMoeda == $('#moeda').val();
				})[0];
				console.log(a);
				$('#taxaVal').val(a.atoms.valorFinal);
			}

		});
	});

	$('#cep').blur(function () {
		$.ajax({
			url: 'http://cep.republicavirtual.com.br/web_cep.php',
			type: 'get',
			dataType: 'json',
			crossDomain: true,
			data: {
				cep: $('#cep').val(), //pega valor do campo
				formato: 'json'
			},
			success: function (res) {
				$('#logradouro').val(res.tipo_logradouro + ' ' + res.logradouro);
				$('#bairro').val(res.bairro);
				$('#cidade').val(res.cidade + ' - ' + res.uf);
			}
		});
	});

	$('#quant').on("keydown keyup", calcTot);

	function calcTot() {
		let valTax = $('#taxaVal').val();
		let quant = $('#quant').val();
		console.log(valTax * quant);
		$('#valorTot').val(valTax * quant);
	}
});



$('.upload-btn').on('click',function(){
	$('#upload-input').click();
	$('.progress-bar').text('0%');
	$('.progress-bar').width('0%');
});

$('#upload-input').on('change',function(){
	
	var files= $(this).get(0).files;
	if (files.length > 0) {
		var formData = new FormData();
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			formData.append('uploads[]', file, file.name);
		}
		$.ajax({
			url: 'https://fxdone.concore.io/documento/create',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (data) {
				console.log('upload successful!\n' + data);
			},

			xhr: function () {
				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener('progress', function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);

						$('.progress-bar').text(percentComplete + '%');
						$('.progress-bar').width(percentComplete + '%');

						if (percentComplete === 100) {
							$('.progress-bar').html('Done');
						}
					}
				}, false);
				return xhr;
			}
		});
	}
});