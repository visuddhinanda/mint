<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskAssignee extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $casts = [
        'id' => 'string'
    ];
    protected $fillable = ['id','task_id','assignee_id','editor_id'];
}
