<?php

	// THIS SCRIPT HAS SECURITY HOLES YOU COULD DRIVE A TRUCK THROUGH!
	// NOT FOR PRODUCTION.
	// MAKE SURE SCRIPT IS MODIFIED TO BE MORE SECURE.

	$final_array = array();
	
	// Initial loops are to set-up the data to be generated and saved to the server...
	foreach ($_POST as $value) {
		$temp_array = array(
			substr($value[0], 0, strpos($value[0], ".")),
			(($value[1] == "image/jpeg") ? "jpg" : "png"),
			substr($value[2], strpos($value[2], ",") + 1)
		);
		
		/*
			To clarify the above code: this will create an Array consisting of 3 items:
			File Name
			File Type
			Data URI
		*/
		
		array_push($final_array, $temp_array);
	}
	
	// Loop through the array and generate data
	foreach ($final_array as $img) {
		$tempName = $img[0];
		$tempType = $img[1];
		$tempURI = $img[2];

		// Save the file to the machine (try to make it unique) - original script used move_uploaded_file();
		file_put_contents("./uploaded-images/$tempName" . mt_rand() . ".$tempType", base64_decode($tempURI));
	}
	
	$response = "If we've gotten this far without an error I'll assume all is good!";
	
	echo $response;
?>