<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    protected $casts = [
        'id' => 'string'
    ];
    protected $fillable = ['id'];
}
