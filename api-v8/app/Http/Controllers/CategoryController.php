<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = $this->loadCategories();
        $books = $this->loadBooks();

        // 获取一级分类和对应的书籍
        $categoryData = [];
        foreach ($categories as $category) {
            if ($category['level'] == 1) {
                $categoryBooks = array_filter($books, function ($book) use ($category) {
                    return $book['category_id'] == $category['id'];
                });
                $categoryData[] = [
                    'category' => $category,
                    'books' => array_slice(array_values($categoryBooks), 0, 3)
                ];
            }
        }

        return view('library.index', compact('categoryData', 'categories'));
    }

    public function show($id)
    {
        $categories = $this->loadCategories();
        $books = $this->loadBooks();

        $currentCategory = collect($categories)->firstWhere('id', $id);
        if (!$currentCategory) {
            abort(404);
        }

        // 获取子分类
        $subCategories = array_filter($categories, function ($cat) use ($id) {
            return $cat['parent_id'] == $id;
        });

        // 获取该分类下的书籍
        $categoryBooks = array_filter($books, function ($book) use ($id) {
            return $book['category_id'] == $id;
        });

        // 获取面包屑
        $breadcrumbs = $this->getBreadcrumbs($currentCategory, $categories);

        return view('library.category', compact('currentCategory', 'subCategories', 'categoryBooks', 'breadcrumbs'));
    }

    private function loadCategories()
    {
        $json = Storage::disk('public')->get('data/categories.json');
        return json_decode($json, true);
    }

    private function loadBooks()
    {
        $json = Storage::disk('public')->get('data/books.json');
        return json_decode($json, true);
    }

    private function getBreadcrumbs($category, $categories)
    {
        $breadcrumbs = [];
        $current = $category;

        while ($current) {
            array_unshift($breadcrumbs, $current);
            $current = collect($categories)->firstWhere('id', $current['parent_id']);
        }

        return $breadcrumbs;
    }
}
