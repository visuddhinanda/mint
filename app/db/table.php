<?php
require_once "../redis/function.php";

// Require Composer's autoloader.
require '../../vendor/autoload.php';
 
// Using Medoo namespace.
use Medoo\Medoo;


class Table
{
    protected $dbh;
	protected $table;
    protected $redis;
    protected $errorMessage;
	protected $field_setting;
	protected $result;
	public $medoo;
	protected $redisProfix;
    function __construct($db,$table,$user="",$password="",$redis=false) {
        $this->dbh = new PDO($db, $user, $password,array(PDO::ATTR_PERSISTENT=>true));
        $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
		$database = new Medoo([
			// Initialized and connected PDO object.
			'pdo' => $this->dbh,
		 
			// [optional] Medoo will have different handle method according to different database type.
			'type' => 'sqlite'
		]);
		
		$this->medoo = $database;
		
		$this->redis = $redis;
		$this->table = $table;
		$this->result = ["ok"=>true,"message"=>"","data"=>array()];
		$this->redisProfix = $table . "/:id";
    }
	
	public function _index($columns,$where){
		$output = $this->medoo->select(
			$this->table,
			$columns,
			$where
		);
		$this->result["data"] = $output;
		return $this->result;
	}
	public function _create($data,$columns){
		foreach ($columns as $value) {
			# code...
			$updateDate[$value] = $data[$value];
		}
		$this->medoo->insert(
			$this->table,
			$updateDate
		);

		$updateDate["id"] = $this->medoo->id();
		$this->result["data"] = $updateDate;
		return $this->result;
	}
	public function _update($data,$columns,$where=null){
		foreach ($columns as $value) {
			# code...
			$updateDate[$value] = $data[$value];
		}

		if($where==null){
			$where = ["id"=>$data["id"]];
		}
		$this->medoo->update(
			$this->table,
			$updateDate,
			$where
		);

		return true;
	}

	public function _show($columns,$id){
		$output = $this->medoo->get(
			$this->table,
			$columns,
			["id"=>$id]
		);
		$this->result["data"] = $output;
		return $this->result;
	}


	public function _deleteId($id){
		$output = $this->medoo->delete(
			$this->table,
			["id"=>$id]
		);
		$this->result["data"] = $output->rowCount();
		return $this->result;
	}
	public function _delete($where){
		$output = $this->medoo->delete(
			$this->table,
			$where
		);
		$this->result["data"] = $output->rowCount();
		if($this->result["data"]==0){
			$this->result["ok"] = false;
			$this->result["message"] = ":no delete";
		}
		return $this->result;
	}



	protected function fetch($query,$params){
		if (isset($params)) {
			$stmt = $this->dbh->prepare($query);
			if($stmt){
				$stmt->execute($params);
			}
			
		} else {
			$stmt = $PDO->query($query);
		}
		if($stmt){
			return $stmt->fetch(PDO::FETCH_ASSOC);
		}
		else{
			return false;
		}
	}

	function execute($query, $params=null){
		if (isset($params)) {
			$stmt = $this->dbh->prepare($query);
			if($stmt){
				$stmt->execute($params);
				return $stmt;				
			}
			else{
				return false;
			}

		} else {
			return $this->dbh->query($query);
		}
	}


}

?>