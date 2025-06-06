<?php
require_once __DIR__."/../../../public/app/config.php";

set_exception_handler(function($e){
	fwrite(STDERR,"error-msg:".$e->getMessage().PHP_EOL);
	fwrite(STDERR,"error-file:".$e->getFile().PHP_EOL);
	fwrite(STDERR,"error-line:".$e->getLine().PHP_EOL);
	exit;
});

$src_db=_SQLITE_DB_STATISTICS_;#源数据库
$src_table=_SQLITE_TABLE_WORD_STATISTICS_;#源表名

$dest_db=_PG_DB_STATISTICS_;#目标数据库
$dest_table=_PG_TABLE_WORD_STATISTICS_;#目标表名

fwrite(STDOUT,__FILE__." start ".PHP_EOL);

#打开源数据库
$PDO_SRC = new PDO($src_db,_DB_USERNAME_,_DB_PASSWORD_,array(PDO::ATTR_PERSISTENT=>true));
$PDO_SRC->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


#打开目标数据库
$PDO_DEST = new PDO($dest_db,_DB_USERNAME_,_DB_PASSWORD_,array(PDO::ATTR_PERSISTENT=>true));
$PDO_DEST->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
fwrite(STDOUT,"open dest ok".PHP_EOL) ;

#删除目标数据库中所有数据
fwrite(STDOUT,"deleting date".PHP_EOL) ;

try{
	$query = "DELETE FROM ".$dest_table;
	$stmt = $PDO_DEST->prepare($query);
	$stmt->execute();
}catch(PDOException $e){
	fwrite(STDERR,"error:".$e->getMessage());
	fwrite(STDERR,"error-line:".$e->getLine().PHP_EOL);
	exit;
}
fwrite(STDOUT,"deleted date".PHP_EOL) ;


// 开始一个事务，关闭自动提交
$count = 0;
fwrite(STDOUT,"begin Transaction".PHP_EOL);

$PDO_DEST->beginTransaction();

$query = "INSERT INTO ".$dest_table." ( bookid , word , count , base , end1 , end2 , type , length , created_at, updated_at ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ?, now(),now() )";
try{
	$stmtDEST = $PDO_DEST->prepare($query);
}catch(PDOException $e){
	fwrite(STDERR,"error:".$e->getMessage());
	exit;
}
#从源数据库中读取
$query = "SELECT *  FROM ".$src_table;

try{
	$stmtSrc = $PDO_SRC->prepare($query);
	$stmtSrc->execute();
}catch(PDOException $e){
	fwrite(STDERR,"error:".$e->getMessage());
	exit;
}
while($srcData = $stmtSrc->fetch(PDO::FETCH_ASSOC)){
	#插入目标表
		$data = array(
						$srcData["bookid"],
						$srcData["word"],
						(int)$srcData["count"],
						$srcData["base"],
						$srcData["end1"],
						$srcData["end2"],
						(int)$srcData["type"],
						(int)$srcData["length"]
					);
	try{					
		$stmtDEST->execute($data);		
	}catch(PDOException $e){
		fwrite(STDERR,"error:".$e->getMessage().implode(',',$data));
		exit;
	}

	$count++;
	if($count%10000==0){
		fwrite(STDOUT,"finished $count".PHP_EOL);
	}
}

// 提交更改

$PDO_DEST->commit();

fwrite(STDOUT,"done".PHP_EOL);






