'use client'


import { useEffect, useState } from "react";
import Player from "../utils/Player.class";
import Ball from "../utils/Ball.class";


export default function Canvas(props) {
	const [ana, GodWilling] = useState(0);
	const n = props.themeN;
    let bgColor = "#353D49";
	let color = "#50CFED";
    const ball = new Ball();
	const player = new Player(0, 0, "#FFF")
	const com = new Player(0, 0, "#5fed55")
	let getSmaller = 0;

	const net = {
		x : 0,
		y : 0,
		height : 10,
		width : 2,
		color : "WHITE"
	}

	if (n === 4)
	{
		bgColor = props.colors.bg;
		com.color = props.colors.p2;
		player.color = props.colors.p1;
	}
	if (n === 2)//theme 1988 switch colors
	{
		bgColor = "#000";
		com.color = "#FFF";
		player.color = "#FFF";
	}
	if (n === 3)
	{
		bgColor = "#FFF";
		player.color = com.color = "#000";
	}
    function StartGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
	{
		//line in the middle of canvas
		net.x = (canvas.width - 2)/2;

		// draw circle, will be used to draw the ball
		function drawArc(x, y, r, color){
			ctx.fillStyle = color;
			ctx.beginPath();
			if (n === 2)
				drawRect(x, y, ball.radius*1.5, ball.radius*1.5, color);
			else
				ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
		function drawText(text,x,y){
			(n === 3 ? ctx.fillStyle = "#000" : ctx.fillStyle = "#FFF")
			ctx.font = "75px fantasy";
			ctx.fillText(text, x, y);
		}
		function drawRect(x, y, w, h, color){
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}
		// draw the net
		function drawNet(){
			if (n === 3)
				net.color = "#000";
			for(let i = 0; i <= canvas.height; i+=15){
				drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
		}
		function collision() {
			player.top = player.y;
			player.bottom = player.y + player.height;
			player.left = player.x;
			player.right = player.x + player.width;
			
			ball.top = ball.y - ball.radius;
			ball.bottom = ball.y + ball.radius;
			ball.left = ball.x - ball.radius;
			ball.right = ball.x + ball.radius;
			
			return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
		}
		//clear canvas
		drawRect(0, 0, canvas.offsetWidth, canvas.offsetHeight, bgColor);
		// draw the user score to the left
		drawText(player.score,canvas.width/4,canvas.height/5);
		drawNet();
		// draw the COM score to the right
		drawText(com.score,3*canvas.width/4,canvas.height/5);
		//draw player Paddle
		drawRect(player.x, player.y, player.width, player.height, player.color);
		//draw the oposite Paddle
		drawRect(canvas.offsetWidth - com.width, com.y , com.width, com.height, com.color);

		//draw the ball
		if (props.ball === true)
        {
            color = "#" +  (Math.ceil(ball.x) < 0 ? Math.ceil(ball.x) * -1 : Math.ceil(ball.x))
                + "" + (Math.ceil(ball.y) < 0 ? Math.ceil(ball.y) * -1 : Math.ceil(ball.x));
            if (color.length !== 7)
                color + "" + Math.floor(Math.random() * 10);
        }
		else if (n === 4)
			color = props.colors.bc;
		else if (n === 3)
			color = "#000";
		else
            color = "white";
        props.ball === true && drawArc(ball.x, ball.y, ball.radius + 2, "white");
        drawArc(ball.x, ball.y, ball.radius, color);
		
		let collAngle = 0;
		const coll = collision();
		if (coll)
		{
			let collidePoint = (ball.y - (player.y + player.height/2));
			// normalize the value of collidePoint, we need to get numbers between -1 and 1.
			// -player.height/2 < collide Point < player.height/2
			collidePoint = collidePoint / (player.height/2);
			
			// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
			// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
			// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
			// Math.PI/4 = 45degrees
			collAngle = (Math.PI/4) * collidePoint;
		}

		if (props.hell === true && player.height > canvas.height / 25)
		{
			player.height -= 0.01;
			com.height -= 0.01;
		}

		props.socket.emit("player", {
			x: player.x,
			y: player.y,
			collision: coll,
			collAngle,
			h: player.height
		});
	}

    useEffect(() => {
		const canvas = document.getElementById('pongy') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		player.height = canvas.height / 4;
		player.width = (canvas.width === 800 ? 10 : 12.5);
		com.height = canvas.height / 4;
		com.width = (canvas.width === 800 ? 10 : 12.5);
		
		// listening to the mouse
		canvas.addEventListener("mousemove", getMousePos);
		
		// listening to the window resize event
		window.addEventListener("resize", ()=>{
			GodWilling(canvas.width);
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			props.socket.emit("resize", {w:canvas.width, h:canvas.height});
		});
		//change player Paddle According to Mouse Position
		function getMousePos(evt: { clientY: number, clientX: number }){
			let rect = canvas.getBoundingClientRect();
			if (canvas.width === 600 && canvas.height === 337) {
				const posY = canvas.height - (evt.clientX - rect.left + 2); 
				if (posY < canvas.height - player.height)
					player.y = posY
			}
			else if (evt.clientY < rect.bottom - player.height)
				player.y = evt.clientY - rect.top + 2; 
			else
				return ;
		}
		props.socket.on('send_canva_W_H', () => {
			props.opData(oldata => {
				const update = {...oldata};
				update.loading = false;
				return (update);
			})
			console.log({w:canvas.width, h:canvas.height});
			props.socket.emit("startGame", {w:canvas.width, h:canvas.height, hell: props.hell});
		});

        props.socket.on('game_Data', data => {
            ball.x = data.x;
			ball.y = data.y;
			player.height = data.h;
			com.height = data.h;
            StartGame(canvas, ctx);
        });
		props.socket.on("playerMov", data => {
			com.x = canvas.width - com.width;
			com.y = data.y;
		});
		props.socket.on("score", data => {
			if (props.socket.id === data.soc)
			{
				player.score = data.p1;
				com.score = data.p2;
			}
			else
			{
				com.score = data.p1;
				player.score = data.p2;
			}
			player.height = canvas.height / 4;
			com.height = canvas.height / 4;
		});
    }, [])



    return (
		//w-[800px] h-[450px]
        // <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md
		//  max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337px]
		//  md:w-[800px] md:h-[450px]
		//  xl:w-[1000px] xl:h-[562px]
		//  "/>
        <canvas id="pongy" className="bg-darken-300 rounded-md
			w-[90%] aspect-[16/9]
			max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337px]
			xl:w-[1000px] xl:h-[562px]
		 "/>
    );
}

/**
 * md	xl		sm
 * 800	1000	600
 * 450	562		337
 * 1.77
 */