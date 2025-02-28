<?php

namespace App\Http\Controllers;

use App\Models\ModelLog;
use Illuminate\Http\Request;
use App\Http\Api\AuthApi;
use App\Http\Resources\ModelLogResource;

class ModelLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $user = AuthApi::current($request);
        if (!$user) {
            return $this->error(__('auth.failed'));
        }
        switch ($request->get('view')) {
            case 'model':
                # code..
                $table = ModelLog::where('model_id', $request->get('id'));
                break;

            default:
                # code...
                break;
        }
        if ($request->has('search')) {
            $table = $table->where('email', 'like', '%' . $request->get('search') . "%");
        }
        $count = $table->count();
        $table = $table->orderBy(
            $request->get('order', 'updated_at'),
            $request->get('dir', 'desc')
        );

        $table = $table->skip($request->get('offset', 0))
            ->take($request->get('limit', 1000));

        $result = $table->get();
        return $this->ok(["rows" => ModelLogResource::collection($result), "count" => $count]);
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
     * @param  \App\Models\ModelLog  $modelLog
     * @return \Illuminate\Http\Response
     */
    public function show(ModelLog $modelLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ModelLog  $modelLog
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ModelLog $modelLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ModelLog  $modelLog
     * @return \Illuminate\Http\Response
     */
    public function destroy(ModelLog $modelLog)
    {
        //
    }
}
