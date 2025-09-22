<?php
////////////////////////////////////////////////////////////
// CouchDB PHP API
// Originally from code located at:
// http://wiki.apache.org/couchdb/GettingStartedWithPhp
//
// Modified by Ryan Lewis to support Exception handling and
// to support CouchDB 0.8.0 views (JSON, not just JS).
//
////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
// Exception
//
class CouchDBException extends Exception {

  function errorMessage() {
    $msg = 'CouchDB exception at '.$this->getLine().' in '.$this->getFile().': '.$this->getMessage();
    return $msg;
  }
}


//////////////////////////////////////////////////
// Response
//
class CouchDBResponse {

  private $raw_response = '';
  private $headers = '';
  private $body = '';

  function __construct($response = '') {
    $this->raw_response = $response;
    list($this->headers, $this->body) = explode("\r\n\r\n", $response);
  }
    
  function getRawResponse() {
    return $this->raw_response;
  }
    
  function getHeaders() {
    return $this->headers;
  }
    
  function getBody($decode_json = false) {
    CouchDB::decode_json($this->body);
    return $decode_json ? CouchDB::decode_json($this->body) : $this->body;
  }
}

//////////////////////////////////////////////////
// Request
//
class CouchDBRequest {

  static $VALID_HTTP_METHODS = array('DELETE', 'GET', 'POST', 'PUT');
    
  private $method = 'GET';
  private $url = '';
  private $data = NULL;
  private $sock = NULL;
    
  function __construct($host, $port = 5984, $url, $method = 'GET', $data = NULL) {
    $method = strtoupper($method);
    $this->host = $host;
    $this->port = $port;
    $this->url = $url;
    $this->method = $method;
    $this->data = $data;
        
    if(!in_array($this->method, self::$VALID_HTTP_METHODS)) {
      throw new CouchDBException('Invalid HTTP method: '.$this->method);
    }
  }
    
  function getRequest() {
    $req = "{$this->method} {$this->url} HTTP/1.0\r\nHost: {$this->host}\r\n";
    if($this->data) {
      $req .= 'Content-Length: '.strlen($this->data)."\r\n";
      $req .= 'Content-Type: application/json'."\r\n\r\n";
      $req .= $this->data."\r\n";
    } else {
      $req .= "\r\n";
    }
        
    return $req;
  }
    
  private function connect() {
    $this->sock = @fsockopen($this->host, $this->port, $err_num, $err_string);
    if(!$this->sock) {
      throw new CouchDBException('Could not open connection to '.$this->host.':'.$this->port.' ('.$err_string.')');
    }    
  }
    
  private function disconnect() {
    fclose($this->sock);
    $this->sock = NULL;
  }
    
  private function execute() {
    fwrite($this->sock, $this->getRequest());

    $response = '';
    while(!feof($this->sock)) {
      $response .= fgets($this->sock);
    }
    $this->response = new CouchDBResponse($response);
    return $this->response;
  }
    
  function send() {
    $this->connect();
    $this->execute();
    $this->disconnect();
    return $this->response;
  }
    
  function getResponse() {
    return $this->response;
  }
}

//////////////////////////////////////////////////
// DB
//
class CouchDB {
  function __construct($db, $host = 'localhost', $port = 5984) {
    $this->db = $db;
    $this->host = $host;
    $this->port = $port;
  }
    
  static function decode_json($str) {
    return json_decode($str);
  }
    
  static function encode_json($str) {
    return json_encode($str);
  }
    
  function send($url, $method = 'get', $data = NULL) {
    $url = '/'.$this->db.(substr($url, 0, 1) == '/' ? $url : '/'.$url);
    $request = new CouchDBRequest($this->host, $this->port, $url, $method, $data);
    return $request->send();
  }
    
  function get_all_docs() {
    return $this->send('/_all_docs');
  }
    
  function get_item($id) {
    return $this->send('/'.$id);
  }
}
?>
