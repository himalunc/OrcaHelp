<?php
	
//----------------------------------------------------------------------------
//	
	
	$host = 'localhost:3306';
	$user = 'orca';
	$pw   = 'dreflori';
	$db   = 'orca';

	$fields = array();
	$tag		= $_GET['tag'];
	$query		= $_GET['query'];
	if(FALSE == strpos($query, ';')) {
		if(0 === strpos($query, 'select')){
			$dbc  = mysqli_connect($host, $user, $pw, $db) or die('Error connecting to database');
			//process request like:
			//	queryXML?tag=runInfo&query=SELECT * FROM runs WHERE machine_id=16
			$result		= mysqli_query($dbc,$query);
			
			//grab the field names and put into an array
			$numFields	= mysqli_num_fields($result);
			while($f=mysqli_fetch_field($result)){
				array_push($fields,$f->name);
			}
			
			//turn the result into an xml response
			$xmlData = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";

			$xmlData .= "<root>";
			while ( $row =  mysqli_fetch_array($result)){
				$xmlData .= "<". $tag . ">";
					for($i=0;$i<$numFields;$i++) {
						$heading = $fields[$i];
						if($heading == 'title')$heading = 'heading'; //arghhh -- special case. apparently 'title' is reserved somewhere
						$test = str_replace("<","[",$row[$fields[$i]]);
						$test = str_replace(">","]",$row[$fields[$i]]);
						$xmlData .= "<" . $heading . ">" . $test  . "</" . $heading . ">";
					}
				$xmlData .= "</" . $tag . ">";
			} 
			$xmlData .= "</root>";

			echo $xmlData;
			mysqli_close($dbc);
		}
	}

?>
