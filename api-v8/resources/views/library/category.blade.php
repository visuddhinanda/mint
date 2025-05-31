@extends('library.layouts.app')

@section('title', $currentCategory['name'] . ' - 巴利书库')

@section('content')
<div class="page-body">
    <div class="container-xl">
        <div class="page-header d-print-none">
            <div class="row align-items-center">
                <div class="col">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="{{ route('home') }}">首页</a></li>
                            @foreach($breadcrumbs as $breadcrumb)
                            @if($loop->last)
                            <li class="breadcrumb-item active">{{ $breadcrumb['name'] }}</li>
                            @else
                            <li class="breadcrumb-item">
                                <a href="{{ route('category.show', $breadcrumb['id']) }}">{{ $breadcrumb['name'] }}</a>
                            </li>
                            @endif
                            @endforeach
                        </ol>
                    </nav>
                    <h2 class="page-title">{{ $currentCategory['name'] }}</h2>
                </div>
            </div>
        </div>

        @if(count($subCategories) > 0)
        <div class="row row-cards mb-4">
            @foreach($subCategories as $subCategory)
            <div class="col-sm-6 col-lg-4">
                <div class="card">
                    <div class="card-body text-center">
                        <div class="avatar avatar-lg mb-3 mx-auto">
                            <svg class="icon" width="24" height="24">
                                <use xlink:href="#tabler-folder"></use>
                            </svg>
                        </div>
                        <h4 class="card-title">{{ $subCategory['name'] }}</h4>
                        <p class="text-muted">{{ $subCategory['description'] ?? '' }}</p>
                        <a href="{{ route('category.show', $subCategory['id']) }}" class="btn btn-primary">
                            进入分类
                        </a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        @endif

        @if(count($categoryBooks) > 0)
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">图书列表</h3>
            </div>
            <div class="card-body">
                <div class="row row-cards">
                    @foreach($categoryBooks as $book)
                    <div class="col-sm-6 col-lg-4">
                        <div class="card book-card h-100">
                            <a href="{{ route('book.show', $book['id']) }}">
                                <img src="{{ $book['cover'] }}" class="card-img-top book-cover" alt="{{ $book['title'] }}">
                            </a>
                            <div class="card-body d-flex flex-column">
                                <h4 class="card-title">
                                    <a href="{{ route('book.show', $book['id']) }}" class="text-decoration-none">
                                        {{ $book['title'] }}
                                    </a>
                                </h4>
                                <div class="text-muted">{{ $book['author'] }}</div>
                                <div class="mt-auto pt-2">
                                    <a href="{{ route('book.show', $book['id']) }}" class="btn btn-sm btn-outline-primary">
                                        查看详情
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
        @endif
    </div>
</div>
@endsection
