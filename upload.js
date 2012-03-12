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
	link.style.display = "inline";
	
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

function uploadFiles(){
	var xhr = new XMLHttpRequest();

	function progressListener (e) {
		console.log("progressListener: ", e);
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
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