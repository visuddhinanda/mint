<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">
            .img {
                max-height: 27.5%;
                /*max-width: 85%;*/
                overflow-x: auto;
                overflow-y: auto;
                border-width: 1px 0 1px 0;
                border-style: dashed;
                border-color: transparent;
                resize: vertical;
                position: relative;
            }

            .img:hover {
                border-color: black;
            }
            .dict {
                width: 45vw;
            }

            .crop_a {
                clip-path: inset(0 0 0 15%);
                margin-left: -15%;
            }
            .crop_b {
                clip-path: inset(0 15% 0 0);
                margin-right: -15%;
            }
            .word {
                width: 10vw;
            }

            .word-img {
                width: 45vw;
            }

            /* 默认滚动条样式 */
            .img::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .img::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 6px;
            }

            .img:not(:hover)::-webkit-scrollbar-track {
                background: transparent;
            }

            .img::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 6px;
                transition: all 0.3s ease;
            }

            .img:not(:hover)::-webkit-scrollbar-thumb {
                background: transparent;
                border-radius: 6px;
                transition: all 0.3s ease;
            }

            .img::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
        <script>
            function copy(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert(text + " 已经拷贝到剪贴板");
                });
            }
        </script>
    </head>
    <body>
        <h3>Page {{ page }}</h3>
        <div style="display: flex">
            <div>
                {{#dict}}
                <div class="img">
                    <img class="dict crop_{{ index }}" src="{{ img }}" />
                </div>
                {{/dict}}
            </div>
            <div>
                <table>
                    {{#words}}
                    <tr>
                        <td class="word">{{ index }}</td>
                        <td class="word">
                            {{ word }}
                            <button onclick="copy('{{ word }}')">复制</button>
                        </td>
                        <td class="word-img">
                            <img src="img/{{ word }}.png" />
                        </td>
                    </tr>
                    {{/words}}
                </table>
            </div>
        </div>
    </body>
</html>
