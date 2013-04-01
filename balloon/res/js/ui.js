$(document).ready(function (){
	
	$('.startGame').on('mousedown touchstart', function(e){
		e.preventDefault();
		WTGM.setScore();
		WTGM.startGame();
		$('.ui').hide();
		$('canvas').show();
		$('.openMenu').show();
	});
	
	$('.openMenu').on('mousedown touchstart', function(e){
		e.preventDefault();
		WTGM.paused=1;
		if (!WTGM.hit){
			WTGM.hit=1;//keine minuspunkte			
		}
		$('.startGame').text('Neustart');
		
		$('.inGameOption').show();		
		$('.inMenuOption').hide();	
		$('.ui').addClass('gameRunning');
		$('.ui').show();
		$('.openMenu').hide();
	});
	
	$('.resumeGame').on('mousedown touchstart', function(e){
		e.preventDefault();

		if (!WTGM.hit){
			WTGM.hit=1;//keine minuspunkte			
		}
		$('.ui').hide();
		$('.openMenu').show();
		
		WTGM.paused=0;
	});
});