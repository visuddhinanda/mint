<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class SetLocale
{
    public function handle($request, Closure $next)
    {
        // 支持的语言列表
        $supportedLocales = ['en', 'zh-Hans', 'zh-Hant'];
        $defaultLocale = config('app.locale', 'en');

        // 1. 检查 URL 参数中的 lang
        $locale = $request->query('lang');

        // 2. 如果没有 URL 参数，检查 Cookie 中的 language
        if (!$locale) {
            $locale = Cookie::get('language');
        }

        // 3. 如果没有 Cookie，检测浏览器语言
        if (!$locale) {
            $locale = $this->getBrowserLocale($request, $supportedLocales);
        }

        // 如果检测到的语言不在支持列表中，使用默认语言
        if (!in_array($locale, $supportedLocales)) {
            $locale = $defaultLocale;
        }

        // 设置应用语言
        App::setLocale($locale);

        // 存储到 Session 和 Cookie（可选：Cookie 有效期为 1 年）
        session(['locale' => $locale]);
        Cookie::queue('language', $locale, 525600); // 525600 分钟 = 1 年

        return $next($request);
    }

    /**
     * 从 HTTP Accept-Language 头获取浏览器语言
     *
     * @param \Illuminate\Http\Request $request
     * @param array $supportedLocales
     * @return string
     */
    protected function getBrowserLocale($request, $supportedLocales)
    {
        $acceptLanguage = $request->header('Accept-Language');
        if (!$acceptLanguage) {
            return config('app.locale', 'en');
        }

        // 解析 Accept-Language 头（格式如：zh-CN,zh;q=0.9,en;q=0.8）
        $languages = array_map(function ($lang) {
            return explode(';', $lang)[0]; // 提取语言代码（如 zh-CN, en）
        }, explode(',', $acceptLanguage));

        // 提取主语言代码并匹配支持的语言
        foreach ($languages as $lang) {
            $mainLang = explode('-', $lang)[0]; // 提取 zh 或 en
            if (in_array($mainLang, $supportedLocales)) {
                return $mainLang;
            }
        }

        // 如果没有匹配的语言，返回默认语言
        return config('app.locale', 'en');
    }
}
