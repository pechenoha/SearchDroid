/**
 * Engine of SearchDroid App
 * @author Vadym Pechenoha
 */

$(document).ready(function(){
	var shur = 2;
	var dovj = 150;

	var objColor;
	var objWidth;
	var objHeight;
	var objLeft;
	var objTop;

	// по дефолту - автоматичні координати для робота
	$('#x').attr('disabled','disabled').addClass('disabl');
	$('#y').attr('disabled','disabled').addClass('disabl');

	// розміри робота
	$('#searchDroid').css({
		'width' : 20 + 'px',
		'height' : 20 + 'px'
	});

	placeDroid(null, true);

	// прикручуємо лісенери для події 'click'
	$('#place_droid').click(placeDroid);
    $('#obstacle_generation').click(obstacleGeneration);

	$('#rndm').change(function() {
		if ($(this).attr('checked') == 'checked') {
			$('#x').attr('disabled','disabled').addClass('disabl');
			$('#y').attr('disabled','disabled').addClass('disabl');
		} else {
			$('#x').attr('disabled',false).removeClass('disabl');
			$('#y').attr('disabled',false).removeClass('disabl');
		}
	});

	$('#form_data').submit(function(eventObject) {  // дія - при натисненні ЗАПУСК

		if ($('#rndm').attr('checked') != 'checked') {
			$('#place_droid').click();
		}
		
		var x = $('#x').val();
		var y = $('#y').val();

		$('#results').html(' <center><b>Блок для виведення результатів</b></center> <br />');

		$('#workingArea').css({
				'width' : (dovj*10),
				'height' : (shur*10),
				'paddingLeft' : (dovj*10),
				'left' : (x*10-dovj*10), 
				'top' : (600-y*10-shur*5)
			}).show().rotate(0);

		setTimeout(searchAnalyser,700);
		eventObject.preventDefault();

		function searchAnalyser() {

			// перевірки на випадки **************************
			// ліва нижня перешкоди (xObstacle_2, yObstacle_2)
			var xObstacle_2 = objLeft;
			var yObstacle_2 = 600 - (objTop + objHeight); // у координатах нашої системи 1000 х 600
			
			// права верхня перешкоди (xObstacle_1, yObstacle_1)
			var xObstacle_1 = objLeft + objWidth;
			var yObstacle_1 = 600 - objTop;        // у координатах нашої системи 1000 х 600
			
			// ліва верхня робота	(xRobot, yRobot)  
			var x = $('#x').val()*10;
			var y = $('#y').val()*10;

			var xRobot = x - 10;
			var yRobot = y + 10;
			
			// перевірка - який випадок
			var startAngle = 0;
			
			if (yObstacle_2 > yRobot) {
				startAngle = 180;
			} else if (xObstacle_1 < xRobot) {
				startAngle = 90;
			}
			// **************************

			var finalAngle = 360;
			var angleStep = 1;
			var angle = 0;

			var programCycle = setInterval(function() {
				angle = angle + angleStep;
				if (angle > finalAngle) {angle = finalAngle;}
				jQuery("#workingArea").rotate(angle);
				jQuery("#searchDroid").rotate(angle);

				if (angle >= startAngle) {
					// виклик функцій перевірки
					if (startAngle == 180) { // якщо випадок 2
						if (topBottom("bottom") == true) { 
							clearInterval(programCycle); 
						} else if (leftRight("left") == true) { 
							clearInterval(programCycle); 
						}
					} else if (startAngle == 90) { // якщо випадок 1
						if (leftRight("right") == true) { 
							clearInterval(programCycle); 
						}
					} else { // у всіх інших випадках
						if (leftRight("left") == true) { 
							clearInterval(programCycle); 
						} else if (topBottom("top") == true) { 
							clearInterval(programCycle); 
						}
					}
				}

				if(angle >= finalAngle) {clearInterval(programCycle);}

			}, angleStep*10);
		}
	});


	function topBottom(where) { // перевірка - верх-низ
		if (where == "top") {
			var y = objTop;  // y = CONST
		} else if (where == "bottom") {
			var y = objTop+objHeight;  // y = CONST
		}
		var x = objLeft; // змінна величина 
		var fl = false;
		while ((x <= (objLeft + objWidth)) && fl == false) { // поки х <= кінця відрізка
			if (document.elementFromPoint(x,y).id == "workingArea") {

				// переводимо в нормальні координати системи 100*60
				x = x/10;
				x = x.toFixed(); // 0 знаків після коми
				
				y = (600-y)/10;
				y = y.toFixed(); // 0 знаків після коми
				// ================================================

				alert ("В координатах (" + x + "; " + y + ') виявлено сторонній об\'єкт ' + objColor + ' кольору.');

				$('#results').html('Роботом <b>SearchDroid 1.0</b> виявлено сторонній об\'єкт в координатах: <br /><b>X:</b> ' + x + '&nbsp&nbsp&nbsp&nbsp <b>Y:</b> ' + y + ' <br />Об\'єкт <b>' + objColor + '</b> кольору.');

				fl = true;
			}
			x++;
		}
		return fl;
	}

	function leftRight(where) { // перевірка - ліво-право
		if (where == "left") {
			var x = objLeft;  // x = CONST
		} else if (where == "right") {
			var x = objLeft + objWidth;  // x = CONST
		}
		var y = objTop; // змінна величина 
		var fl = false;
		while ((y <= (objTop + objHeight)) && fl == false) { // поки y <= кінця відрізка
			if (typeof document.elementFromPoint(x,y) !== undefined && document.elementFromPoint(x,y).id == "workingArea") {
				// переводимо в нормальні координати системи 100*60
				x = x/10;
				x = x.toFixed();
				y = (600-y)/10;
				y = y.toFixed();

				alert ("В координатах (" + x + "; " + y + ') виявлено сторонній об\'єкт ' + objColor + ' кольору.');

				$('#results').html('Роботом <b>SearchDroid 1.0</b> виявлено сторонній об\'єкт в координатах: <br /><b>X:</b> ' + x + '&nbsp&nbsp&nbsp&nbsp <b>Y:</b> ' + y + ' <br />Об\'єкт <b>' + objColor + '</b> кольору.');
				fl = true;
			}
			y++;
		}
		return fl;
	}
	
	function placeDroid(e, middle) { // роміщення робота в іншій точці

		$('#workingArea').hide();
		$('#searchDroid').rotate(0);

		if (middle) {
			x = 50;
			y = 30;

			$('#x').val(50);
			$('#y').val(30);
		} else if ($('#rndm').attr('checked') == 'checked') {
			var x = Math.random()*100;
			var y = Math.random()*100;

			if (y>60) {y = y-40;}

			x = x.toFixed();
			y = y.toFixed();

			$('#x').val(x);
			$('#y').val(y);
		} else {
			var x = $('#x').val();
			var y = $('#y').val();

			// перевірки на межі
			if (x>100) {x = 100;}
			if (y>60) {y = 60;}
			if (x<0) {x = 0;}
			if (y<0) {y = 0;}
		}

		$('#searchDroid').css({
				'left' : (x*10-shur*5),
				'top' : (600-y*10-shur*5)
		});

		if (e) {
			e.preventDefault();
		}
	}
	
	function obstacleGeneration(e) { // генерування об'єктів

		objWidth = myRandom(40, 150);
		objHeight = myRandom(40, 120);

		objLeft = myRandom(0, 1000);
		while (objLeft+objWidth>1000) {
			objLeft = myRandom(0, 900);
		}

		objTop = myRandom(0, 500);
		while (objTop+objHeight>600) {
			objTop = myRandom(0, 500);
		}

		var colors = [
				"008000",
				"0000CD",
				"800000",
				"FF00FF",
				"B8860B",
				"DC143C"
		];

		var colorId = myRandom(0, 5);

		switch(colorId) {
			case 0:
				objColor = "зеленого";
				break;
			case 1:
				objColor = "синього";
				break;
			case 2:
				objColor = "бордового";
				break;
			case 3:
				objColor = "рожевого";
				break;
			case 4:
				objColor = "жовтого";
				break;
			case 5:
				objColor = "червоного";
				break;
		}

		var randAngle = myRandom(0,10);
		$('#obj').css({
			'width'       : objWidth + 'px',
			'height'      : objHeight + 'px',
			'left'        : objLeft + 'px',
			'top'         : objTop + 'px', 
			'background'  : '#' + colors[colorId] 
		}).rotate(randAngle);
		$('#obj').show();
		e.preventDefault();
	}

	function myRandom (from, to) {
		return Math.floor((Math.random() * (to - from + 1)) + from);
	}

});