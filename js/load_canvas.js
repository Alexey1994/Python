function load_canvas()
{
	var width=50;
	var height=50;
	var size_pixel=10;

	var canvas=document.getElementById('canvas');
	var context=canvas.getContext('2d');

	canvas.width=width*size_pixel;
	canvas.height=height*size_pixel;

	context.beginPath();

	function pixel(x, y)
	{
		context.fillStyle='#000';
		context.fillRect(x*size_pixel, y*size_pixel, size_pixel, size_pixel);
	}

	function clear(x, y)
	{
		context.fillStyle='#FFF';
		context.fillRect(x*size_pixel, y*size_pixel, size_pixel, size_pixel);
	}

	function game()
	{
		var level=new Array(width);
		var redraw_id;
		var speed=100;
		var key=0;
		var point={'x':0, 'y':0};
		var vector='right';
		var python=new Array(3);

		python[0]={'x':0, 'y':0};
		python[1]={'x':1, 'y':0};
		python[2]={'x':2, 'y':0};

		for(var i=0; i<width; i++)
			level[i]=new Array(height);

		level[0][0]=true;
		level[1][0]=true;
		level[2][0]=true;

		function draw_level()
		{
			for(i=0; i<width; i++)
			{
				for(j=0; j<height; j++)
				{
					if(level[i][j])
						pixel(i, j);
					else
						clear(i, j);
				}
			}
		}

		window.onkeydown=function(event)
		{
			key=event.keyCode;
		}

		function add_point()
		{
			var tmp_point={'x':0, 'y':0};

			var add_point_async_id=setInterval(function()
			{
				var is_continue;

				do
				{
					is_continue=false;
					tmp_point.x=Math.floor(Math.random()*width);
					tmp_point.y=Math.floor(Math.random()*height);

					for(var i=0; i<python.length; i++)
						if(python[i].x==tmp_point.x && python[i].y==tmp_point.y)
						{
							is_continue=true;
							break;
						}
				}
				while(is_continue);

				clearInterval(add_point_async_id);
				point=tmp_point;
			},1);
		}
		
		var migalka=true;
		
		function draw_point()
		{
			if(migalka)
				pixel(point.x, point.y);
			else
				clear(point.x, point.y);

			migalka=!migalka;
		}

		function redraw()
		{
			switch(key)
			{
				case 65: 
					if(vector!='right')
						vector='left'; 
					break;

				case 68: 
					if(vector!='left')
						vector='right'; 
					break;

				case 87: 
					if(vector!='down')
						vector='up'; 
					break;	

				case 83: 
					if(vector!='up')
						vector='down'; 
					break;	
			}

			switch(vector)
			{
				case 'right':
					if(python[python.length-1].x+1==width)
					{
						clearInterval(redraw_id);
						game_over();
						break;
					}

					python.push({'x': python[python.length-1].x+1, 'y': python[python.length-1].y});
					break;

				case 'left':
					if(python[python.length-1].x==0)
					{
						clearInterval(redraw_id);
						game_over();
						break;
					}

					python.push({'x': python[python.length-1].x-1, 'y': python[python.length-1].y});
					break;

				case 'up':
					if(python[python.length-1].y==0)
					{
						clearInterval(redraw_id);
						game_over();
						break;
					}

					python.push({'x': python[python.length-1].x, 'y': python[python.length-1].y-1});
					break;

				case 'down':
					if(python[python.length-1].y+1==height	)
					{
						clearInterval(redraw_id);
						game_over();
						break;
					}

					python.push({'x': python[python.length-1].x, 'y': python[python.length-1].y+1});
					break;
			}

			if(python[python.length-1].x==point.x && python[python.length-1].y==point.y)
				add_point();
			else
			{
				var del_point=python.shift();
				level[del_point.x][del_point.y]=false;
			}
			level[python[python.length-1].x][python[python.length-1].y]=true;

			for(var i=0; i<python.length-1; i++)
				if(python[python.length-1].x==python[i].x && python[python.length-1].y==python[i].y)
				{
					clearInterval(redraw_id);
					game_over();
				}

			draw_level();
			draw_point();
			key=0;
		}

		add_point();
		draw_level();
		redraw_id=setInterval(redraw,speed);
	}

	function game_over()
	{
		var key=0;

		for(var i=0; i<width; i++)
			for(var j=0; j<height; j++)
				clear(i,j);

		window.onkeydown=function(event)
		{
			game();
		}
	}

	game();
}

window.onload=load_canvas();