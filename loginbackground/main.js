var canvas = document.getElementById('canvas')
var h = window.innerHeight
var w = window.innerWidth
canvas.width = w
canvas.height = h
const thiscanvas = canvas.getContext('2d')
var fps = {
	count: 0,
	dateNow: +new Date
}
var bg = {
	particles: [],
	init: () => {
		var n = 200
		while (n--) {
			bg.particles.push(bg.setParticles())
		}
		bg.run()
	},
	setParticles: () => {
		var x = rand(0, w),
			y = rand(0, h),
			r = rand(0, 255, 1),
			g = rand(0, 255, 1),
			b = rand(0, 255, 1),
			a = Math.random(),
			vx = rand(0, 1, 0, 1) / 3,
			vy = rand(0, 1, 0, 1) / 3


		return { //(x,y)(r,g,b,a)(vx,vy)
			x: x,
			y: y,
			r: r,
			g: g,
			b: b,
			a: a,
			vx: vx,
			vy: vy
		}
	},
	draw: () => {
		thiscanvas.clearRect(0, 0, w, h)
		var len = bg.particles.length;
		//画点
		for (var i = 0; i < len; i++) {
			var p = bg.particles[i]
			thiscanvas.beginPath()
			//here we can see the difference between rgb and rgba
			//thiscanvas.fillStyle = 'rgb(' + p.r + ',' + p.g + ',' + p.b + ')'
			thiscanvas.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + p.a + ')'
			thiscanvas.arc(p.x, p.y, 1, 0, Math.PI * 2)
			thiscanvas.fill()
			thiscanvas.closePath()
		}
		//画线
		var limit = parseInt((w > h) ? w / 20 : h / 20)
		for (var i = 0; i < len; i++) {
			var p = bg.particles[i]
			for (var j = i + 1; j < len; j++) {
				var pp = bg.particles[j]
				if (distance(p.x, p.y, pp.x, pp.y) > limit) continue
				thiscanvas.beginPath()
				let style = thiscanvas.createLinearGradient(p.x, p.y, pp.x, pp.y)
				style.addColorStop(0, "rgba(" + p.r + "," + p.g + "," + p.b + ",.3)")
				style.addColorStop(1, "rgba(" + pp.r + "," + pp.g + "," + pp.b + ",.3)")
				thiscanvas.strokeStyle = style
				thiscanvas.moveTo(p.x, p.y)
				thiscanvas.lineTo(pp.x, pp.y)
				thiscanvas.stroke()
				thiscanvas.closePath()
			}
		}
	},
	run: () => {
		bg.draw()
		for (var i in bg.particles) {
			var p = bg.particles[i]
			p.x += p.vx
			p.y += p.vy
			p.r += parseInt(Math.random() * 3)
			p.g += parseInt(Math.random() * 3)
			p.b += parseInt(Math.random() * 3)
			p.vx = (p.x <= 0 || p.x > w) ? -p.vx : p.vx
			p.vy = (p.y <= 0 || p.y > h) ? -p.vy : p.vy
			p.vx = (Math.abs(p.vx) > 0.33) ? p.vx / 1.01 : p.vx
			p.vy = (Math.abs(p.vy) > 0.33) ? p.vy / 1.01 : p.vy
			p.r = (p.r > 255) ? 100 : p.r
			p.g = (p.g > 255) ? 100 : p.g
			p.b = (p.b > 255) ? 100 : p.b
		}
		printfps()
		fps.count++
		requestAnimationFrame(() => bg.run())
	},
	tap: (x, y) => {
		for (var i in bg.particles) {
			var p = bg.particles[i]
			if (distance(x, y, p.x, p.y) > 100) continue
			p.vx = ((p.x - x) < 0) ? -p.vx : p.vx
			p.vy = ((p.y - y) < 0) ? -p.vy : p.vy
			p.vx = (Math.abs(p.vx) > 1) ? p.vx : p.vx * 10
			p.vy = (Math.abs(p.vy) > 1) ? p.vy : p.vy * 10
		}
	}
}
bg.init()

function printfps() {
	if (+new Date - fps.dateNow >= 1000) {
		console.log('fps: ' + fps.count)
		fps.count = 0
		fps.dateNow = +new Date
	}
}

function rand(a, b, c, d) {
	var x = Math.random() * b
	var x = c ? parseInt(x) : x
	var x = d ? Math.random() > 0.5 ? -x : x : x
	return x
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

canvas.onclick = function(e) {
	bg.tap(e.offsetX, e.offsetY)
}
