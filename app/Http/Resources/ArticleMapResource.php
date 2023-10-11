<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\UserApi;

class ArticleMapResource extends JsonResource
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
            'id' => $this->id,
            "collect_id" => $this->collect_id,
            "article_id" => $this->article_id,
            "level" => $this->level,
            "title" => $this->title,
            "editor"=> UserApi::getById($this->editor_id),
            "children" => $this->children,
            "deleted_at" => $this->deleted_at,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
        return parent::toArray($request);
    }
}