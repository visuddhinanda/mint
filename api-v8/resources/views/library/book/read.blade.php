@extends('library.layouts.app')

@section('title', '阅读: ' . $book['title'])

@section('content')
<div class="page-body">
    <div class="container-xl">
        <div class="row">
            <div class="col-md-3">
                <div class="card position-sticky" style="top: 1rem;">
                    <div class="card-header">
                        <h4 class="card-title">目录</h4>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush">
                            @if(isset($book['contents']))
                            @foreach($book['contents'] as $chapter)
                            <a href="#chapter-{{ $loop->iteration }}"
                                class="list-group-item list-group-item-action">
                                {{ $chapter['title'] }}
                            </a>
                            @endforeach
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="card-title">{{ $book['title'] }}</h3>
                            <div class="text-muted">{{ $book['author'] }}</div>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="adjustFontSize(-1)">
                                <svg class="icon" width="24" height="24">
                                    <use xlink:href="#tabler-minus"></use>
                                </svg>
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="adjustFontSize(1)">
                                <svg class="icon" width="24" height="24">
                                    <use xlink:href="#tabler-plus"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-body" id="reading-content" style="font-size: 16px; line-height: 1.8;">
                        @if(isset($book['contents']))
                        @foreach($book['contents'] as $chapter)
                        <div id="chapter-{{ $loop->iteration }}" class="mb-5">
                            <h4 class="mb-3">{{ $chapter['title'] }}</h4>
                            <div class="text-justify">
                                {!! nl2br(e($chapter['content'])) !!}
                            </div>
                        </div>
                        @endforeach
                        @else
                        <div class="text-justify">
                            <p>这是《{{ $book['title'] }}》的正文内容。在这里显示完整的书籍内容，支持章节导航和字体大小调整。</p>
                            <p>本书由{{ $book['author'] }}著，是巴利语系佛教的重要典籍之一。内容深奥，值得反复研读。</p>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function adjustFontSize(delta) {
        const content = document.getElementById('reading-content');
        const currentSize = parseInt(window.getComputedStyle(content).fontSize);
        const newSize = Math.max(12, Math.min(24, currentSize + delta));
        content.style.fontSize = newSize + 'px';
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
</script>
@endpush
@endsection
