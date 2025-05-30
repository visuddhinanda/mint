<?php
//查询term字典
require_once "../config.php";
require_once "../public/_pdo.php";

//is login
if (isset($_COOKIE["username"]) && !empty($_COOKIE["username"])) {
    $username = $_COOKIE["username"];
} else {
    $username = "";
}

if (isset($_GET["op"])) {
    $_op = $_GET["op"];
} else if (isset($_POST["op"])) {
    $_op = $_POST["op"];
}
if (isset($_GET["word"])) {
    $_word = mb_strtolower($_GET["word"], 'UTF-8');

}

if (isset($_GET["id"])) {
    $_id = $_GET["id"];
}

global $PDO;
PDO_Connect(_FILE_DB_PALI_SENTENCE_);

if (isset($_GET["sent"])) {
    $_sent = mb_strtolower($_GET["sent"], 'UTF-8');
}

// 输入一个句子，输出整个句子的单词 array
function words_of_sentence(string $sent)
{
    $words = preg_split("/[ \.\[\]\{\}\-,';‘’–0123456789]+/", $sent); // 去除标点、数字
    $words = array_filter($words); // 去除空词
    $words = array_filter($words, function ($item) {
        if ($item != 'ca' && $item != 'vā' && $item != 'na') {
            return $item;
        }
    }); // 去除 ca, vā 和 na
    return $words;
}

// 采用 jaccard 相似度，考虑到圣典中的相似句单词、句式都是非常接近的
function jaccard_similarity($words_of_sent1, $words_of_sent2)
{
    $intersect = count(array_intersect($words_of_sent1, $words_of_sent2));
    $union = count($words_of_sent1) + count($words_of_sent2) - $intersect;
    if ($union) {
        return $intersect / $union;
    } else {
        return 0;
    }
}

// 带顺序的 jaccard 算法，当前效果一般，TODO: 切片相同时加入得分
function ordered_jaccard_similarity($words_of_sent1, $words_of_sent2)
{
    $score = 0;
    $k = min(count($words_of_sent1), count($words_of_sent2));
    for ($i = 1; $i < $k; $i++) {
        $score += jaccard_similarity(
            array_slice($words_of_sent1, 0, $i),
            array_slice($words_of_sent2, 0, $i));
    }
    return $score / $k;
}

// 定义一个链表节点，方便 sim_sent_id 按照相似度插入
class sim_sent_node
{
    public $id;
    public $jaccard_score;
    public $next;

    public function __construct($id = null, $jaccard_score = null, $next = null)
    {
        $this->id = $id;
        $this->jaccard_score = $jaccard_score;
        $this->next = $next;
    }
}

// 定义链表
class sim_sent_list
{
    public $head; // 头节点，默认一个虚头节点
    public $size;

    public function __construct()
    {
        $this->head = new sim_sent_node();
        $this->size = 0;
    }

    // 按照 jaccard_score 相似度插入
    public function jaccard_add($id, $jaccard_score)
    {
        $prev = $this->head;
        while ($prev->next != null && $prev->next->jaccard_score > $jaccard_score) {
            $prev = $prev->next;
        }
        $prev->next = new sim_sent_node($id, $jaccard_score, $prev->next);
        $this->size++;
    }

    public function get_text_list()
    {
        $prev = $this->head;
        if ($this->size == 0) {
            return;
        }

        $ids = "";
        while ($prev->next != null) {
            $ids = $ids . "," . $prev->next->id;
            $prev = $prev->next;
        }
        $ids = substr($ids, 1); // 去掉第一个逗号
        return $ids;
    }

    public function print_list()
    {
        $prev = $this->head;
        if ($this->size == 0) {
            return;
        }
        while ($prev->next != null) {
            print($prev->next->id . "\t" . $prev->next->jaccard_score . "\n");
            $prev = $prev->next;
        }
    }
}

// 将相似句列表存入数据库
function insert_similar_sent_list_into_sqlite($current_id, $text_list)
{
    /* 使用这部分代码先为数据库添加一个 sim_sents 字段
    $add_column = "ALTER TABLE pali_sent ADD COLUMN sim_sents TEXT";
    $Action_add = PDO_Execute($add_column);
    $query = "PRAGMA TABLE_INFO (pali_sent)";
    $Fetch = PDO_FetchALL($query);
    print_r($Fetch);
     */
    global $PDO;
    $Update = "UPDATE pali_sent SET sim_sents = " . $PDO->quote($text_list) . " WHERE id = " . $current_id;
    $Result = PDO_Execute($Update);
    return;
}

// 预计算，存入数据库
function similar_sent_matrix()
{
    // 按照 count = 18, 8, ..., 255 依次获得查询结果 (i-3,i+3)
    //          count = 17,16,...,7                                       (i-2,i+2)
    for ($current_count = 17; $current_count > 7; $current_count--) {
        print("单词数：" . $current_count . "\n");
        $current_query = "select id,text from pali_sent where count=" . $current_count;
        $Current = PDO_FetchAll($current_query);
        if (count($Current)) {
            foreach ($Current as $current_row) {
                $current_id = $current_row['id'];
                $current_sent = $current_row['text'];
                $current_words = words_of_sentence($current_sent);

                // 按照 count > $current_count-3 and count <$current_count+3 查询希望比较的语句
                $compare_query = "select id,text from pali_sent where count>" . ($current_count - 2) . " and count<" . ($current_count + 2);
                $Compare = PDO_FetchALL($compare_query);

                $current_sim_sent_list = new sim_sent_list(); // 新建相似句链表
                foreach ($Compare as $compare_row) {
                    if ($current_row != $compare_row) {
                        $compare_id = $compare_row['id'];
                        $compare_sent = $compare_row['text'];
                        $compare_words = words_of_sentence($compare_sent);

                        $jaccard_score = jaccard_similarity($current_words, $compare_words);
                        if ($jaccard_score > 0.3) {
                            $current_sim_sent_list->jaccard_add($compare_id, $jaccard_score);
                        }
                    }
                } // end of foreach $compare_row

                if ($current_sim_sent_list->size != 0) {
                    print("update " . $current_id . "\n");
                    $text_list = $current_sim_sent_list->get_text_list();
                    insert_similar_sent_list_into_sqlite($current_id, $text_list);
                }
            } // end of foreach $current_row
        }
    }
    return;
}

// 实时计算相似句
function sents_similar_to_id($id)
{
    $query = "SELECT count,text FROM pali_sent WHERE id=" . $id;
    $Current = PDO_FetchALL($query);
    if (count($Current)) {
        foreach ($Current as $current_row) {
            $current_count = $current_row['count'];
            $current_sent = $current_row['text'];
            $current_words = words_of_sentence($current_sent);
            print("current text: \n" . $current_sent . "\n");

            if ($current_count <= 5) {
                print("[-] too short.\n");
                return;
            }

            // 只和单词数大于 5 的比较
            $compare_query = "SELECT id,text FROM pali_sent WHERE count>5";
            $Compare = PDO_FetchALL($compare_query);

            $current_sim_sent_list = new sim_sent_list(); // 新建相似句链表
            foreach ($Compare as $compare_row) {
                if ($current_row != $compare_row) {
                    $compare_id = $compare_row['id'];
                    $compare_sent = $compare_row['text'];
                    $compare_words = words_of_sentence($compare_sent);

                    $jaccard_score = jaccard_similarity($current_words, $compare_words);
                    if ($jaccard_score > 0.3) {
                        print("Jaccard similarity: " . $jaccard_score . "\tSentence id:" . $compare_id . "\n");
                        print("Text: \n" . $compare_sent . "\n");
                        $current_sim_sent_list->jaccard_add($compare_id, $jaccard_score);
                    }
                }
            } // end of foreach $compare_row

            if ($current_sim_sent_list->size != 0) {
                // $current_sim_sent_list->print_list();
            } else {
                print("[-]not found.\n");
            }

        } // end of foreach($Current)
    } // end of if (count($Current))
}

$id = $argv[1];
//sents_similar_to_id($id);

if (!isset($_op)) {
    exit(0);
}

switch ($_op) {
    case "get":
        {
            $Fetch = array();
            if (isset($_word)) {
                $queryWord = str_replace(" ", "", $_word);
                $query = "select book,paragraph,text from pali_sent where \"real\" like " . $PDO->quote("%" . $queryWord . '%') . " limit 0,5";
                $Fetch = PDO_FetchAll($query);
                $newList = array();
                //去掉重复的
                foreach ($Fetch as $onerow) {
                    $found = false;
                    foreach ($newList as $new) {
                        if ($onerow["text"] == $new["text"]) {
                            $found = true;
                            break;
                        }
                    }
                    if ($found == false) {
                        array_push($newList, $onerow);
                    }
                }
                $Fetch = $newList;

                if (count($Fetch) < 5) {
                    $query = "select text from pali_sent where \"real_en\" like " . $PDO->quote('%' . $queryWord . '%') . " limit 0,5";
                    $Fetch2 = PDO_FetchAll($query);
                    //去掉重复的
                    foreach ($Fetch2 as $onerow) {
                        $found = false;
                        foreach ($Fetch as $oldArray) {
                            if ($onerow["word"] == $oldArray["word"]) {
                                $found = true;
                                break;
                            }
                        }
                        if ($found == false) {
                            array_push($Fetch, $onerow);
                        }
                    }
                }

            } else if (isset($_id)) {
            }
            echo json_encode($Fetch, JSON_UNESCAPED_UNICODE);
            break;
        }
}
