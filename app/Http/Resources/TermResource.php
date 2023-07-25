<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\ChannelApi;
use App\Http\Api\StudioApi;
use App\Http\Api\UserApi;
use App\Http\Api\MdRender;

class TermResource extends JsonResource
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
            "id"=>$this->id,
            "guid"=>$this->guid,
            "word"=> $this->word,
            "word_en"=> $this->word_en,
            "meaning"=> $this->meaning,
            "other_meaning"=> $this->other_meaning,
            "tag"=> $this->tag,
            "note"=> $this->note,
            "language"=> $this->language,
            "channal"=> $this->channal,
            "studio" => StudioApi::getById($this->owner),
            "editor"=> UserApi::getById($this->editor_id),
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
        ];

        if(!empty($this->channal)){
            $channelId = $this->channal;
            $data["channel"] = ChannelApi::getById($this->channal);
        }else{
            $channelId = ChannelApi::getSysChannel('_community_translation_'.$this->language.'_');
            if(empty($channelId)){
                $channelId = ChannelApi::getSysChannel('_community_translation_zh-hans_');
            }
        }
        if(!empty($this->note) && !empty($channelId)){
            $data["html"] = MdRender::render($this->note,[$channelId],null,'read');
        }
        return $data;
    }
}