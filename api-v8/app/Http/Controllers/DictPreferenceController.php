<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

use App\Models\UserDict;
use App\Models\WordIndex;
use App\Http\Resources\DictPreferenceResource;
use App\Http\Api\DictApi;

class DictPreferenceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $dict_id = DictApi::getSysDict('system_preference');
        if(!$dict_id){
            return $this->error('没有找到 system_preference 字典',200,200);
        }
        $table = WordIndex::where('user_dicts.dict_id',$dict_id)
                    ->leftJoin('user_dicts','word_indices.word','=','user_dicts.word')
                    ->select([
                        'user_dicts.id',
                        'word_indices.word',
                        'word_indices.count',
                        'user_dicts.factors',
                        'user_dicts.parent',
                        'user_dicts.note',
                        'user_dicts.confidence',
                    ]);
        //处理搜索
        if(!empty($request->get("keyword"))){
            $table = $table->where('word_indices.word', 'like', "%".$request->get("keyword")."%");
        }

        //获取记录总条数
        $count = $table->count();
        //处理排序
        $table = $table->orderBy($request->get("order",'word_indices.count'),
                                    $request->get("dir",'desc'));
        //处理分页
        $table = $table->skip($request->get("offset",0))
                        ->take($request->get("limit",200));
        //获取数据
        $result = $table->get();
        return $this->ok([
            "rows"=>DictPreferenceResource::collection($result),
            "count"=>$count
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UserDict  $userDict
     * @return \Illuminate\Http\Response
     */
    public function show(UserDict $userDict)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,  $id)
    {
        //
		$newData = $request->all();
		$result = UserDict::where('id', $id)
				->update($newData);
		if($result){
			return $this->ok('ok');
		}else{
		    return $this->error("没有查询到数据");
		}
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserDict  $userDict
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserDict $userDict)
    {
        //
    }
}
