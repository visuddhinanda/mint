<?php 
#目录设置，不能更改
require_once __DIR__."/config.dir.php";

#域名设置
define("WWW_DOMAIN_PROTOCOL","https");
define("WWW_DOMAIN_NAME","www.wikipali.org");
define("RPC_DOMAIN_NAME","rpc.wikipali.org");
/*
电子邮件设置
PHPMailer
*/
define("Email", [
				 "Host"=>"smtp.gmail.com",//Set the SMTP server to send through
				 "SMTPAuth"=>true,//Enable SMTP authentication
				 "Username"=>'your@gmail.com',//SMTP username
				 "Password"=>'your_password',//SMTP password
				 "Port"=>465,//TCP port to connect to 465; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
				 "From"=>"your@gmail.com",
				 "Sender"=>"sender"
				 ]);

/*
数据库设置
*/
define("Database",[
	"type"=>"pgsql",
	"server"=>"localhost",
	"port"=>5432,
	"name"=>"mint",
	"sslmode" => "disable",
	"user" => "postgres",
	"password" => "123456"
]);


/*
Redis 设置，
*/
define("Redis",[
	"host" => "127.0.0.1",
	"port" => 6379,
	"password" => "",
	"prefix"=>"aaa://"
]);
				
# 雪花id
define("SnowFlake",[
	"DatacenterId"=>1,
	"WorkerId"=>1
]);
/*
数据表
*/
#表设置，此行不能更改
require_once __DIR__."/config.table.php";

#表名设置，此行不能更改
require_once __DIR__."/config.migrate.php";


?>