<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\UserApi;

class RelationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id"=>$this->id,
            "name"=> $this->name,
            "case"=> json_decode($this->case),
            "to"=> json_decode($this->to),
            "editor"=> UserApi::getById($this->editor_id),
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
        ];
    }
}