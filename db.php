<?php
#error_reporting(0);

$cmd= $_REQUEST['cmd'];

$user= $_REQUEST['user'];
$password= $_REQUEST['password'];
$database= $_REQUEST['database'];

$db= new mysqli();
if (!@$db->real_connect("localhost", $user, $password, $database))
  die_jsonp(array('error' => "Connect failed",
                  'explain' => mysqli_connect_error()));

$db->set_charset('utf8');

$r= $db->query($cmd)
  or die_jsonp(array('error' => 'Query failed.',
                     'explain' => $db->error,
                     'cmd' => $cmd));

$result= array(
  'cmd' => $cmd,
  'num_rows' => $r->num_rows,
  'fields' => array(),
  'rows' => array(),
);

for ($i= 0; $i < $r->field_count; $i++) {
  $result['fields'][]= array('name' => $r->fetch_field_direct($i)->name);
}

while ($row= $r->fetch_row()) {
  $result['rows'][]= $row;
}

echo jsonp($result);

function jsonp($data) {
  if (preg_match('/\W/', $_GET['callback'])) {
    // if $_GET['callback'] contains a non-word character,
    // this could be an XSS attack.
    header('HTTP/1.1 400 Bad Request');
    exit();
  }
  header('Content-type: application/json; charset=utf-8');
  if ($_GET['callback']) {
    return sprintf('%s(%s);', $_GET['callback'], json_encode($data));
  }
  return json_encode($data);
}

function die_jsonp($data) {
  if (!is_array($data)) {
    $data= array('error' => $data);
  }
  die(jsonp($data));
}
