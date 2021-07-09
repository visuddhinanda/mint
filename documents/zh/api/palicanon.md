# 主题：语料库

## 用标签查段落
> 参照：book_tag.php
### 功能
根据输入标签，输出符合这个标签的标题
### 参数
- GET
- `tag` 以逗号分隔的标签字符串
- `lang`  语言 如 en, zh-hans
  
### rest api
    api/palicanon/[lang]/[tag]

### 返回

格式：json
```
[
    {
        book: int,
        para: int,
        level: int,
        title: string,
        progress:  int,
        trans_title： string, 
    }
]
````

- `book` int 书号  范围 1-217,
- `para` int,段落编号 
- `level` int 目录层级 ,
- `title` string 巴利语标题 ,
- `progress`: int 章节译文完成度  0-100
- `trans_title` string, 根据lang查找对应的标题 如果没有查询到 无该变量
