<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SentHistory extends Model
{
    use HasFactory;
    const UPDATED_AT = null;
    protected $casts = [
		'id' => 'string'
	];
}
