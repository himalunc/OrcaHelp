<?php
	
//----------------------------------------------------------------------------
//process request like:
//	queryXML?tag=runInfo&query=SELECT * FROM runs WHERE machine_id=16
//	
	
	$host = 'localhost:3306';
	$user = 'orca';
	$pw   = 'dreflori';
	$db   = 'orca';
	
	$dbc  = mysqli_connect($host, $user, $pw, $db) or die('Error connecting to database');

	$fields = array();
	$tag	= $_GET['tag'];
	$query	= $_GET['query'];
	if(strpos($query, ';') === false) {
		if(strpos($query, "SELECT") === 0 || strpos($query, "select") === 0){
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
						$test = str_replace("<","[",$row[$fields[$i]]);
						$test = str_replace(">","]",$test);
						$xmlData .= "<" . $fields[$i] . ">" . $test  . "</" . $fields[$i] . ">";
					}
				$xmlData .= "</" . $tag . ">";
			} 

			$xmlData .= "</root>";

			echo $xmlData;
		}

		else if(strpos($query, 'INSERT') === 0) {
			mysqli_query($dbc,$query);
			//turn the result into an xml response
			$xmlData = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
			$xmlData .= "<root>";
			$xmlData .= "<". $tag . ">";
			$xmlData .= "<INSERT> DONE </INSERT>";
			$xmlData .= "</" . $tag . ">";
			$xmlData .= "</root>";
			echo $xmlData;
		}
		else if(strpos($query, 'DELETE') === 0) {
			mysqli_query($dbc,$query);
			$xmlData = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
			$xmlData .= "<root>";
			$xmlData .= "<". $tag . ">";
			$xmlData .= "<DELETE> DONE </DELETE>";
			$xmlData .= "</" . $tag . ">";
			$xmlData .= "</root>";
			echo $xmlData;
		}
	}

	mysqli_close($dbc);
?>
