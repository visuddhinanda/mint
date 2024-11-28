<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DictPreferenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [
            'id' => strval($this->id),
            'word'=>$this->word,
            'count'=>$this->count,
            'parent'=>$this->parent,
            'note'=>$this->note,
            'factors'=>$this->factors,
            'confidence'=>$this->confidence,
            'updated_at'=>$this->updated_at,
            'creator_id'=>$this->creator_id,
           ];
        return $data;
    }
}
