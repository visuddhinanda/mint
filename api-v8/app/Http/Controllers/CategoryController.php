<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\PaliText;
use App\Models\ProgressChapter;
use App\Models\Tag;
use App\Models\TagMap;

class CategoryController extends Controller
{
    protected static int $nextId = 1;
    public function index()
    {
        $categories = $this->loadCategories();
        $books = $this->loadBooks();

        // 获取一级分类和对应的书籍
        $categoryData = [];
        foreach ($categories as $category) {
            if ($category['level'] == 1) {
                $categoryBooks = $this->getBooks($categories, $category['id']);
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
        $categoryBooks = $this->getBooks($categories, $id);
        // 获取面包屑
        $breadcrumbs = $this->getBreadcrumbs($currentCategory, $categories);

        return view('library.category', compact('currentCategory', 'subCategories', 'categoryBooks', 'breadcrumbs'));
    }

    private function getBooks($categories, $id)
    {
        $currentCategory = collect($categories)->firstWhere('id', $id);
        if (!$currentCategory) {
            abort(404);
        }

        // 标签查章节
        $tagNames = $currentCategory['tag'];
        $tm = (new TagMap)->getTable();
        $tg = (new Tag)->getTable();
        $pt = (new PaliText)->getTable();
        $where1 = " where co = " . count($tagNames);
        $a = implode(",", array_fill(0, count($tagNames), '?'));
        $in1 = "and t.name in ({$a})";
        $param = $tagNames;
        $where2 = "where level = 1";
        $query = "
                        select uid as id,book,paragraph,level,toc as title,chapter_strlen,parent,path from (
                            select anchor_id as cid from (
                                select tm.anchor_id , count(*) as co
                                    from $tm as  tm
                                    left join $tg as t on tm.tag_id = t.id
                                    where tm.table_name  = 'pali_texts'
                                    $in1
                                    group by tm.anchor_id
                            ) T
                                $where1
                        ) CID
                        left join $pt as pt on CID.cid = pt.uid
                        $where2
                        order by book,paragraph";

        $chapters = DB::select($query, $param);
        $chaptersParam = [];
        foreach ($chapters as $key => $chapter) {
            $chaptersParam[] = [$chapter->book, $chapter->paragraph];
        }
        // 获取该分类下的章节
        $books = ProgressChapter::with('channel.owner')->whereIns(['book', 'para'], $chaptersParam)
            ->whereHas('channel', function ($query) {
                $query->where('status', 30);
            })
            ->where('progress', '>', 0.2)
            ->get();

        $pali = PaliText::where('level', 1)->get();
        // 获取该分类下的书籍
        $categoryBooks = [];
        $books->each(function ($book) use (&$categoryBooks, $id, $pali) {
            $title = $book->title;
            if (empty($title)) {
                $title = $pali->firstWhere('book', $book->book)->toc;
            }
            $categoryBooks[] = [
                "id" => $book->uid,
                "title" => $title,
                "author" => $book->channel->name,
                "publisher" => $book->channel->owner->nickname,
                "type" => __('labels.' . $book->channel->type),
                "category_id" => $id,
                "cover" => "/assets/images/cover/1/214.jpg",
                "description" => $book->summary ?? "比库戒律的详细说明",
                "language" => __('language.' . $book->channel->lang),
                "contents" => [
                    [
                        "title" => "比库戒本",
                        "content" => "诸恶莫作，众善奉行，自净其意，是诸佛教...",
                        "summary" => "基本戒律",
                    ]
                ],
            ];
        });
        return $categoryBooks;
    }
    private function loadCategories()
    {
        $json = file_get_contents(public_path("app/palicanon/category/default.json"));
        $tree = json_decode($json, true);
        $flat = self::flattenWithIds($tree);
        return $flat;
    }

    private function loadBooks()
    {
        $json = Storage::disk('public')->get('data/books.json');
        return json_decode($json, true);
    }
    public static function flattenWithIds(array $tree, int $parentId = 0, int $level = 1): array
    {

        $flat = [];

        foreach ($tree as $node) {
            $currentId = self::$nextId++;

            $item = [
                'id' => $currentId,
                'parent_id' => $parentId,
                'name' => $node['name'] ?? null,
                'tag' => $node['tag'] ?? [],
                "description" => "佛教戒律经典",
                'level' => $level,
            ];

            $flat[] = $item;

            if (isset($node['children']) && is_array($node['children'])) {
                $childrenLevel = $level + 1;
                $flat = array_merge($flat, self::flattenWithIds($node['children'], $currentId, $childrenLevel));
            }
        }

        return $flat;
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
