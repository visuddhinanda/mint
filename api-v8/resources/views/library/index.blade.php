@extends('library.layouts.app')

@section('title', '巴利书库 - 首页')

@section('content')
<div class="page-body">
    <div class="container-xl">
        <div class="page-header d-print-none">
            <div class="row align-items-center">
                <div class="col">
                    <h2 class="page-title">巴利书库</h2>
                    <div class="text-muted mt-1">探索古老的佛教经典</div>
                </div>
            </div>
        </div>

        @foreach($categoryData as $data)
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="card-title">
                    <svg class="icon me-2" width="24" height="24">
                        <use xlink:href="#tabler-book"></use>
                    </svg>
                    {{ $data['category']['name'] }}
                </h3>
                <div class="card-actions">
                    <a href="{{ route('category.show', $data['category']['id']) }}" class="btn btn-primary btn-sm">
                        更多
                        <svg class="icon ms-1" width="24" height="24">
                            <use xlink:href="#tabler-arrow-right"></use>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div class="row row-cards">
                    @foreach($data['books'] as $book)
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
        @endforeach
    </div>
</div>
@endsection
