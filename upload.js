/*
 * Required features:
 * 		addEventListener (Google Chrome 1+, FF 1+, IE 9+, Opera 7+, Safari 1+)
 *		canvas (Google Chrome 4+, FF 2+, IE 9+, Safari 3.1+)
 * 		FileReader (Google Chrome 7+, FF 3.6+, IE 10+)
 *		FormData (Google Chrome 7+, FF 4+, Safari 5+)
 */
if (("addEventListener" in window) && ("FileReader" in window) && ("FormData" in window) && !!document.createElement("canvas").getContext) {
	window.addEventListener("DOMContentLoaded", init, false);
} else {
	alert("This demo wont work for you, sorry - please upgrade your web browser");
	document.getElementById("browsers").style.display = "block";
}

var formdata, link, input, doc = document, canvas = doc.createElement("canvas");

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
			// We need to use FileReader to generate the image
			// because we don't have access to user's directory path (only the selected file name)
			// So FileReader generates a Data URL for us to use to set the image source to
			reader = new FileReader();
			reader.onloadend = function (e) { 
				createImage(e.target.result, e, this.file);
			};
			reader.readAsDataURL(file);
			reader.file = file; // because the 'onloadend' event is asynchronous we need to store the current 'file' reference for later access
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

function createImage (source, fileobj, file) {
	var element = doc.createElement("img");
		element.file = fileobj;
		element.src = source;
		
		// when we apply the 'thumbnail' class the height and width will change to 100px
		element["data-originalheight"] = element.height;
		element["data-originalwidth"] = element.width;
		
		element.className = "thumbnail";

	// We store the file object as a property of the image (for use later)
	doc.body.appendChild(element);
	
	// Modify the image (using Canvas) before appending it
	element.onload = function(){
		modifyImageBeforeAppending(this, file);
	}
}

function modifyImageBeforeAppending (img, file) {
	var dataurl,
		imgdata,
		pix,
		milliseconds = +new Date(),
		newCanvas = canvas.cloneNode(false),
        ctx = newCanvas.getContext("2d"),
        orgWidth = img["data-originalwidth"],
        orgHeight = img["data-originalheight"],
        newWidth = 400, // new image width to be generated
        newHeight = orgHeight / orgWidth * 400; // new image height to be generated (with aspect ratio)
        
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    newCanvas.style.cssText = "display:block; margin-bottom:1em;";
        
	// (image, srcX, srcY, srcWidth, srcHeight, newX, newY, newWidth, newHeight);
	ctx.drawImage(img, 0, 0, orgWidth, orgHeight, 0, 0, newWidth, newHeight);
	
	// Let's mess with the colours next…
	// Grab the image data (x, y, w, h)
	imgdata = ctx.getImageData(0, 0, newWidth, newHeight);
	pix = imgdata.data;
	
	/*
	// Invert the colours
	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i  ] = 255 - pix[i  ];	// red
		pix[i+1] = 255 - pix[i+1];	// green
		pix[i+2] = 255 - pix[i+2];	// blue
		pix[i+3] = 180;				// alpha (255 is full opacity)
	}
	*/
	
	// Convert to greyscale
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11; // calculation for greyscale (http://spyrestudios.com/html5-canvas-image-effects-black-white/)
		pix[i  ] = grayscale;	// red
		pix[i+1] = grayscale;	// green
		pix[i+2] = grayscale;	// blue
	}	
	
	// Now re-apply the inverted colours to the image
	ctx.putImageData(imgdata, 0, 0);
	
	// Lets see what the canvas is looking like (i.e. display on screen)
	doc.body.insertBefore(newCanvas, doc.body.firstChild);
	
	// Generate a new Data URL which we'll send to the server-side script to decode and save
	dataurl = newCanvas.toDataURL();
	
	/*
		We can only pass a File object, Blob or String data to a FormData object.
		So because of this if we just passed the key as images[] (which PHP sees as an Array) 
		then every time this function is callsed the images[] key would get overwritten with latest data.
		So instead with give the key a unique name by converting Date() object into milliseconds.
	*/
	formdata.append("images_" + milliseconds + "[]", file.name);
	formdata.append("images_" + milliseconds + "[]", file.type);
	formdata.append("images_" + milliseconds + "[]", dataurl);
}

var progressBar = (function(){
	var bar = doc.createElement("div"),
		progress = doc.createElement("div");
		
	bar.id = "bar";
	progress.className = "progress";
	progress.setAttribute("data-percentage", "0%");
		
	doc.body.insertBefore(bar, doc.getElementById("upload-link").nextSibling);
	bar.appendChild(progress);
	
	return function (percentage) {
		progress.setAttribute("data-percentage", percentage + "%");
		progress.style.width = (percentage * 2) + 'px';
	}
}());

function uploadFiles(){
	var xhr = new XMLHttpRequest();
	
	function progressListener (e) {
		console.log("progressListener: ", e);
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
			progressBar(percentage);
			console.log("Percentage loaded: ", percentage);
		}
	};

	function finishUpload (e) {
		progressBar(100);
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
					console.log(xhr.responseText);
				}
			}
		}
	};
	
	xhr.send(formdata);
}