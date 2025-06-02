<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ProgressChapter;
use App\Models\PaliText;

class BookController extends Controller
{
    public function show($id)
    {
        $bookRaw = $this->loadBook($id);

        if (!$bookRaw) {
            abort(404);
        }

        //查询章节
        $channelId = $bookRaw->channel_id; // 替换为具体的 channel_id 值

        $paliTexts = PaliText::where('book', $bookRaw->book)
            ->where('paragraph', '>', $bookRaw->para)
            ->where('level', 2)->orderBy('paragraph')->get();
        $chapters = ProgressChapter::where('book', $bookRaw->book)
            ->where('para', '>', $bookRaw->para)
            ->where('channel_id', $channelId)->orderBy('para')->get();
        $book =  [
            "id" => $bookRaw->uid,
            "title" => $bookRaw->title . "(" . $bookRaw->book . "-" . $bookRaw->para . ")",
            "author" => $bookRaw->channel->name,
            "publisher" => $bookRaw->channel->owner->nickname,
            "type" => __('label.' . $bookRaw->channel->type),
            "category_id" => 11,
            "cover" => "/assets/images/cover/1/214.jpg",
            "description" => $book->summary ?? "比库戒律的详细说明",
            "language" => __('language.' . $bookRaw->channel->lang),
            "contents" => $paliTexts->map(function ($paliText) use ($chapters) {
                $title = $paliText->toc;
                if (count($chapters) > 0) {

                    $found = array_filter($chapters->toArray(), function ($chapter) use ($paliText) {
                        return $chapter['book'] == $paliText->book && $chapter['para'] == $paliText->paragraph;
                    });
                    if (count($found) > 0) {
                        $chapter = array_shift($found);
                        if (!empty($chapter['title'])) {
                            $title = $chapter['title'];
                        }
                        if (!empty($chapter['summary'])) {
                            $summary = $chapter['summary'];
                        }
                        $progress = (int)($chapter['progress'] * 100);
                    }
                }
                return [
                    "title" => $title,
                    "content" => "诸恶莫作，众善奉行，自净其意，是诸佛教...",
                    "summary" => $summary ?? "",
                    "progress" => $progress ?? 0,
                ];
            }),
        ];

        // 获取其他版本
        $others = ProgressChapter::with('channel.owner')
            ->where('book', $bookRaw->book)
            ->where('para', $bookRaw->para)
            ->whereHas('channel', function ($query) {
                $query->where('status', 30);
            })
            ->where('progress', '>', 0.2)
            ->get();

        $otherVersions = [];
        $others->each(function ($book) use (&$otherVersions, $id) {
            $otherVersions[] = [
                "id" => $book->uid,
                "title" => $book->title . "(" . $book->book . "-" . $book->para . ")",
                "author" => $book->channel->name,
                "publisher" => $book->channel->owner->nickname,
                "type" => __('label.' . $book->channel->type),
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

        return view('library.book.show', compact('book', 'otherVersions'));
    }

    public function read($id)
    {
        $books = $this->loadBooks();
        $book = collect($books)->firstWhere('id', $id);

        if (!$book) {
            abort(404);
        }

        return view('library.book.read', compact('book'));
    }

    private function loadBook($id)
    {
        $book = ProgressChapter::with('channel.owner')->find($id);
        return $book;
    }
}
