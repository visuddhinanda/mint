<?php
$lua = new Lua();
function user_lookup_has($currUser,$word){
    //访问数据库，查询用户是否查询过$word
    echo "接收到lua传来的参数 user:{$currUser[1]} word:{$word}\n";
    return true;
}
$currUser = [1=>'visuddhinanda','user_id'];//lua table index begin with 1

$lua->assign("currUser", $currUser); 
$lua->registerCallback("user_lookup_has", "user_lookup_has");
$lua->eval(<<<CODE
function onDone()
    local ok = user_lookup_has(currUser,"budha")
    if(ok) then
        return ok,'成功了'
    else
        return ok,'没有查询指定的内容，请用去尾查询法在字典中查找到budho的词典原型'
    end
end
CODE
);

$result = $lua->call('onDone');
var_dump($result);
