	/*
	 * Required features:
	 * 		addEventListener (Google Chrome 1+, FF 1+, IE 9+, Opera 7+, Safari 1+)
	 * 		FileReader (Google Chrome 7+, FF 3.6+, IE 10+)
	 *		FormData (Google Chrome 7+, FF 4+, Safari 5+)
	 */
	if (("addEventListener" in window) && ("FileReader" in window) && ("FormData" in window)) {
		window.addEventListener("DOMContentLoaded", init, false);
	} else {
		alert("This demo wont work for you, sorry - please upgrade your web browser");
		document.getElementById("browsers").style.display = "block";
	}
	
	var formdata, link, input, doc = document;
	
	function init(){
		formdata = new FormData()
		
		link = doc.getElementById("upload-link"),
		input = doc.getElementById("upload");
	
		// Now we know the browser supports the required features we can display the 'browse' button
		link.style.display = "inline-block";
		
		link.addEventListener("click", process, false);
		input.addEventListener("change", displaySelectedFiles, false);
	}
	
	function process (e) {
		// If the input element is found then trigger the click event (which opens the file select dialog window)
		if (input) {
			input.click();
		}
	
		e.preventDefault();
	}
	
	function displaySelectedFiles(){
		// Once a user selects some files the 'change' event is triggered (and this listener function is executed)
		// We can access selected files via 'this.files' property object.
		
		var img, reader, file;
		
		for (var i = 0, len = this.files.length; i < len; i++) {
			file = this.files[i];
		
			if (!!file.type.match(/image.*/)) {
				if (window.FileReader) {
					reader = new FileReader();
					reader.onloadend = function (e) { 
						createImage(e.target.result, e);
					};
					reader.readAsDataURL(file);
				}
				
				if (formdata) {
					/*
						The append method simply takes a key and a value. 
						In our case, our key is images[]; 
						By adding the square-brackets to the end, we make sure each time we append another value, 
						we’re actually appending it to that array, instead of overwriting the image property.
					 */
					formdata.append("images[]", file);
				}
			}	
		}
		
		// We only need to create the 'upload' button once	
		if (!doc.getElementById("confirm")) {
			var confirm = doc.createElement("input");
				confirm.type = "submit";
				confirm.value = "Upload these files";
				confirm.id = "confirm";
		
			doc.body.appendChild(confirm);
		
			confirm.addEventListener("click", uploadFiles, false);
		}
		
		// We only need to create the 'clear' button once	
		if (!doc.getElementById("clear")) {
			var clear = doc.createElement("input");
				clear.type = "button";
				clear.value = "Clear these files";
				clear.id = "clear";
		
			doc.body.appendChild(clear);
		
			clear.addEventListener("click", function(){
				window.location.reload();
			}, false);
		}
	}
	
	function createImage (source, fileobj) {
		var element = doc.createElement("img");
			element.file = fileobj;
			element.className = "thumbnail";
			element.src = source;
	
		// We store the file object as a property of the image (for use later)
		doc.body.appendChild(element);
	}
	
	// Code for the progress bar was taken from here: 
	// http://www.splashnology.com/article/how-to-create-a-progress-bar-with-html5-canvas/478/
	var progressBar = (function(){
		var i = 0,
			res = 0,
			context = null,
			total_width = 300,
			total_height = 34,
			initial_x = 20,
			initial_y = 20,
			radius = total_height/2,
			canvas = doc.createElement("canvas");
			canvas.id = "bar";
			canvas.height = 74;
			canvas.width = 340;
		
		doc.body.insertBefore(canvas, doc.body.firstChild);
			
       	context = canvas.getContext('2d');

        // set font
        context.font = "16px Verdana";

        // Blue gradient for progress bar
        var progress_lingrad = context.createLinearGradient(0,initial_y+total_height,0,0);
        progress_lingrad.addColorStop(0, '#4DA4F3');
        progress_lingrad.addColorStop(0.4, '#ADD9FF');
        progress_lingrad.addColorStop(1, '#9ED1FF');
        context.fillStyle = progress_lingrad;

        //res = setInterval(draw, 30);

        function draw() {
            i+=1;
            // Clear everything before drawing
            context.clearRect(initial_x-5,initial_y-5,total_width+15,total_height+15);
            progressLayerRect(context, initial_x, initial_y, total_width, total_height, radius);
            progressBarRect(context, initial_x, initial_y, i, total_height, radius, total_width);
            progressText(context, initial_x, initial_y, i, total_height, radius, total_width );
            if (i>=total_width) {
                //clearInterval(res);
                console.log("we're finished uploading");
            }
        }

        /**
         * Draws a rounded rectangle.
         * @param {CanvasContext} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} radius The corner radius;
         */
        function roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
            ctx.closePath();
            ctx.fill();
        }

        /**
         * Draws a rounded rectangle.
         * @param {CanvasContext} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} radius The corner radius;
         */
        function roundInsetRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            // Draw huge anti-clockwise box
            ctx.moveTo(1000, 1000);
            ctx.lineTo(1000, -1000);
            ctx.lineTo(-1000, -1000);
            ctx.lineTo(-1000, 1000);
            ctx.lineTo(1000, 1000);
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
            ctx.closePath();
            ctx.fill();
        }

        function progressLayerRect(ctx, x, y, width, height, radius) {
            ctx.save();
            // Set shadows to make some depth
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#666';

             // Create initial grey layer
            ctx.fillStyle = 'rgba(189,189,189,1)';
            roundRect(ctx, x, y, width, height, radius);

            // Overlay with gradient
            ctx.shadowColor = 'rgba(0,0,0,0)'
            var lingrad = ctx.createLinearGradient(0,y+height,0,0);
            lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
            lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
            lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
            ctx.fillStyle = lingrad;
            roundRect(ctx, x, y, width, height, radius);

            ctx.fillStyle = 'white';

            ctx.restore();
        }

        /**
         * Draws a half-rounded progress bar to properly fill rounded under-layer
         * @param {CanvasContext} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the bar
         * @param {Number} height The height of the bar
         * @param {Number} radius The corner radius;
         * @param {Number} max The under-layer total width;
         */
        function progressBarRect(ctx, x, y, width, height, radius, max) {
            // var to store offset for proper filling when inside rounded area
            var offset = 0;
            ctx.beginPath();
            if (width<radius) {
                offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
                ctx.moveTo(x + width, y+offset);
                ctx.lineTo(x + width, y+height-offset);
                ctx.arc(x + radius, y + radius, radius, Math.PI - Math.acos((radius - width) / radius), Math.PI + Math.acos((radius - width) / radius), false);
            }
            else if (width+radius>max) {
                offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width, y);
                ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -Math.acos((radius - (max-width)) / radius), false);
                ctx.lineTo(x + width, y+height-offset);
                ctx.arc(x+max-radius, y + radius, radius, Math.acos((radius - (max-width)) / radius), Math.PI/2, false);
                ctx.lineTo(x + radius, y + height);
                ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
            }
            else {
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width, y);
                ctx.lineTo(x + width, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
            }
            ctx.closePath();
            ctx.fill();

            // draw progress bar right border shadow
            if (width<max-1) {
                ctx.save();
                ctx.shadowOffsetX = 1;
                ctx.shadowBlur = 1;
                ctx.shadowColor = '#666';
                if (width+radius>max)
                  offset = offset+1;
                ctx.fillRect(x+width,y+offset,1,total_height-offset*2);
                ctx.restore();
            }
        }

        /**
         * Draws properly-positioned progress bar percent text
         * @param {CanvasContext} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the bar
         * @param {Number} height The height of the bar
         * @param {Number} radius The corner radius;
         * @param {Number} max The under-layer total width;
         */
        function progressText(ctx, x, y, width, height, radius, max) {
            ctx.save();
            ctx.fillStyle = 'white';
            var text = Math.floor(width/max*100)+"%";
            var text_width = ctx.measureText(text).width;
            var text_x = x+width-text_width-radius/2;
            if (width<=radius+text_width) {
                text_x = x+radius/2;
            }
            ctx.fillText(text, text_x, y+22);
            ctx.restore();
        }
        
        return function(percentage) {
        	i = percentage;
        	
        	// Because of the odd way the progress bar is written I've add to first multiple the percentage by the width
        	// e.g. the width is 300 so I do percentage*3
        	// But if the percentage bar goes to 300 (which should equate to 100%) rather than 299 then it breaks, so I have to go to 299?
        	if (percentage === 300) {
        		i = 299;
        	} 
        	draw();
        }
	}())
	
	function uploadFiles(){
		var xhr = new XMLHttpRequest();
		
		function progressListener (e) {
			console.log("progressListener: ", e);
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				progressBar(percentage*3); // update progress bar (because the width of the bar is 300 we need to multiple 1 by 3)
				console.log("Percentage loaded: ", percentage);
			}
		};
	
		function finishUpload (e) {
			console.log("Finished Percentage loaded: 100");
		};
	
		// XHR2 has an upload property with a 'progress' event
		xhr.upload.addEventListener("progress", progressListener, false);
	
		// XHR2 has an upload property with a 'load' event
		xhr.upload.addEventListener("load", finishUpload, false);
	
		// Begin uploading of file
		xhr.open("POST", "upload.php");
	
	    xhr.onreadystatechange = function(){
	    	console.info("readyState: ", this.readyState);
	    	if (this.readyState == 4) {
	      		if ((this.status >= 200 && this.status < 300) || this.status == 304) {
	        		if (this.responseText != "") {
						alert(xhr.responseText);
					}
				}
			}
		};
	
		xhr.send(formdata);
	}