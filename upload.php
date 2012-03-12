<?php
	
	$response = "";
	
	// http://net.tutsplus.com/tutorials/javascript-ajax/uploading-files-with-ajax/
	foreach ($_FILES["images"]["error"] as $key => $error) { 
    	if ($error == UPLOAD_ERR_OK) {  
        	$name = $_FILES["images"]["name"][$key];
        	move_uploaded_file( $_FILES["images"]["tmp_name"][$key], "uploaded-images/" . $_FILES['images']['name'][$key]);
        	$response = "Files have been uploaded";
    	} else {
    		$response = $error;
    	}
	}
	
	echo $response;
	
	/*
	Example of formdata passed through…
	
	array(5) { 
		["name"]=> array(4) { 
			[0]=> string(13) "Generic-2.jpg" 
			[1]=> string(13) "Generic-3.jpg" 
			[2]=> string(13) "Generic-4.jpg" 
			[3]=> string(13) "Generic-5.jpg" 
		} 
		["type"]=> array(4) { 
			[0]=> string(10) "image/jpeg" 
			[1]=> string(10) "image/jpeg" 
			[2]=> string(10) "image/jpeg" 
			[3]=> string(10) "image/jpeg" 
		} 
		["tmp_name"]=> array(4) { 
			[0]=> string(36) "/Applications/MAMP/tmp/php/phprzscxs" 
			[1]=> string(36) "/Applications/MAMP/tmp/php/php1cnfqk" 
			[2]=> string(36) "/Applications/MAMP/tmp/php/phpVkS89p" 
			[3]=> string(36) "/Applications/MAMP/tmp/php/phptSfmwt" 
		} 
		["error"]=> array(4) { 
			[0]=> int(0) 
			[1]=> int(0) 
			[2]=> int(0) 
			[3]=> int(0) 
		} 
		["size"]=> array(4) { 
			[0]=> int(130120) 
			[1]=> int(397627) 
			[2]=> int(578842) 
			[3]=> int(840531) 
		} 
	} 
	*/
?>