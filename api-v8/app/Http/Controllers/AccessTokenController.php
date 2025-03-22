<?php

namespace App\Http\Controllers;

use App\Models\AccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;

class AccessTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        $payload = $request->get('payload');
        $result = array();
        foreach ($payload as $key => $value) {
            //获取token
            $token = AccessToken::firstOrNew(
                [
                    'res_type' => $value['res_type'],
                    'res_id' => $value['res_id']
                ],
                [
                    'token' => (string)Str::uuid()
                ]
            );
            if (!$token->exists) {
                $token->save();
            }

            try {
                $jwt = JWT::encode($value, $token->token, 'HS512');
            } catch (\Exception $e) {
                Log::error('jwt', ['error' => $e]);
                continue;
            }
            $result[] = [
                'payload' => $value,
                'token' => $jwt
            ];
        }
        return $this->ok(['rows' => $result, 'count' => count($result)]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AccessToken  $accessToken
     * @return \Illuminate\Http\Response
     */
    public function show(AccessToken $accessToken)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AccessToken  $accessToken
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AccessToken $accessToken)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AccessToken  $accessToken
     * @return \Illuminate\Http\Response
     */
    public function destroy(AccessToken $accessToken)
    {
        //
    }
}
