<?php

return [
    'app' => [
        'icp_code' => env('APP_ICP_CODE', ''),
        'mps_code' => env('APP_MPS_CODE', ''),
    ],
    'languages' => [
        'en' => 'English',
        'zh-Hans' => '简体中文',
        'zh-Hant' => '繁体中文',
    ],
    'default_language' => 'en',
    'library' => [
        'list_min_progress' => env('LIBRARY_LIST_MIN_PROGRESS', 0.5),
    ],
    'snowflake' => [
        'data_center_id' => env('SNOWFLAKE_DATA_CENTER_ID', 1),
        'worker_id' => env('SNOWFLAKE_WORKER_ID', 1),
        /*
        |--------------------------------------------------------------------------
        | snowflake id start date don't modify
        |--------------------------------------------------------------------------
        */
        'start' => "2021-12-22",
    ],

    'server' => [
        'rpc' => [
            'grpc' =>  env('GRPC_WEB_SERVER', "http://localhost:9999"),

            'morus' => [
                'host' => env('MORUS_GRPC_HOST', "localhost"),
                'port' => env('MORUS_GRPC_PORT', 9999),
            ],

            'lily' => [
                'host' => env('LILY_GRPC_HOST', "localhost"),
                'port' => env('LILY_GRPC_PORT', 9000),
            ],

            'tulip' => [
                'host' => env('TULIP_GRPC_HOST', "localhost"),
                'port' => env('TULIP_GRPC_PORT', 9990),
            ],
        ],
        'api' => [
            'default' => env('APP_API', "http://localhost:8000/api"),
            'bamboo' => env('BAMBOO_API_HOST', env('APP_URL') . '/api'),
        ],
        'assets' => env('ASSETS_SERVER', "localhost:9999"),

        'dashboard_base_path' => env('DASHBOARD_BASE_PATH', "http://127.0.0.1:3000/my"),

        'cdn_urls' => explode(',', env('CDN_URLS', "https://www.wikipali.cc/downloads")),


    ],

    'attachments' => [
        'bucket_name' => [
            'temporary' => env('ATTACHMENTS_TEMPORARY_BUCKET_NAME', "attachments-staging"),
            'permanent' => env('ATTACHMENTS_PERMANENT_BUCKET_NAME', "attachments-staging"),
        ],
    ],

    'cache' => [
        //这个值prod,staging无需设置
        'expire' => env('CACHE_EXPIRE', 36000),
    ],

    /*
    |--------------------------------------------------------------------------
    | 另外增添的路径
    |--------------------------------------------------------------------------
    |
    |
    */
    'path' => [
        'dependence' => storage_path('depandence'),
        'palitext' => public_path('palihtml'),
        'palitext_filelist' => public_path('palihtml') . '/filelist.csv',
        'palicsv' => public_path('tmp') . '/palicsv',
        'pali_title' => public_path('pali_title'),
        'paliword' => public_path('paliword'),
        'paliword_book' => public_path('paliword') . "/book",
        'paliword_index' => public_path('paliword') . "/index",
        'word_statistics' => public_path('dependence') . "/word_statistics/data",
        'dict_text' => public_path('dicttext'),
    ],

    'admin' => [
        'root_uuid' => '6e12f8ea-ee4d-4e0f-a6b0-472f2d99a814',
        'robot_uuid' => '6e12f8ea-ee4d-4e0f-a6b0-472f2d99a814',
        'cs_channel' => '1e4b926d-54d7-4932-b8a6-7cdc65abd992',
    ],

    'dependence' => [
        [
            'url' => 'https://www.github.com/iapt-platform/wipali-globle',
            'path' => 'wipali-globle',
        ],
    ],

    'email' => [
        'ScheduleEmailOutputTo' => env('SCHEDULE_EMAIL_OUTPUTTO', 'kosalla1987@126.com'),
        'ScheduleEmailOutputOnFailure' => env('SCHEDULE_EMAIL_OUTPUTONFAILURE', 'kosalla1987@126.com'),
    ],

    'ai' => [
        'assistant' => 'test161',
        'default' => 'kimi',
        'logo' => [
            'gemini' => 'gemini-color.png',
            'grok' => 'grok.png',
            'Claude' => 'claude-color.png',
            'api.openai.com' => 'openai.png',
            'qwen' => 'qwen-color.png',
            'deepseek' => 'deepseek-color.png'
        ]
    ],
    'mq' => [
        'loop_limit' => [
            'ai_translate' => env('MQ_LOOP_LIMIT_AI_TRANSLATE', 0)
        ]
    ],
    'rabbitmq' => [
        'queues' => [
            'ai_translate' => [
                'retry_times' => env('RABBITMQ_AI_RETRY_TIMES', 3),
                'max_loop_count' => env('RABBITMQ_AI_MAX_LOOP', 10),
                'timeout' => env('RABBITMQ_AI_TIMEOUT', 300),
                'dead_letter_queue' => 'ai_translate_dlq',
                'dead_letter_exchange' => 'ai_translate_dlx',
            ],
        ],

        // 死信队列配置
        'dead_letter_queues' => [
            'ai_translate_dlq' => [
                'ttl' => 86400000, // 24小时 TTL (毫秒)
                'max_length' => 10000,
            ],
        ],
    ],
];
