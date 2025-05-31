<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function show($id)
    {
        $books = $this->loadBooks();
        $book = collect($books)->firstWhere('id', $id);

        if (!$book) {
            abort(404);
        }

        // 获取其他版本
        $otherVersions = array_filter($books, function ($b) use ($book) {
            return $b['title'] == $book['title'] && $b['id'] != $book['id'];
        });

        return view('library.book.show', compact('book', 'otherVersions'));
    }

    public function read($id)
    {
        $books = $this->loadBooks();
        $book = collect($books)->firstWhere('id', $id);

        if (!$book) {
            abort(404);
        }

        return view('book.read', compact('book'));
    }

    private function loadBooks()
    {
        $json = Storage::disk('public')->get('data/books.json');
        return json_decode($json, true);
    }
}
