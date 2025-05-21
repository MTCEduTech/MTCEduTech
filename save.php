<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = file_get_contents("php://input");
  if (!empty($data)) {
    file_put_contents("accounts.json", $data);
    echo json_encode(["status" => "success"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Dữ liệu trống"]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "Chỉ chấp nhận POST"]);
}
?>
