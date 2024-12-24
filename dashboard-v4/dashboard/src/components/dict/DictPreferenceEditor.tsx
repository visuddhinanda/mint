import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { get, put } from "../../request";
import { IWbw } from "../template/Wbw/WbwWord";
import WbwLookup from "../template/Wbw/WbwLookup";
import { useState } from "react";
import { Button, Progress } from "antd";
import WbwFactorsEditor from "../template/Wbw/WbwFactorsEditor";

interface IPreferenceListResponse {
  ok: boolean;
  message: string;
  data: { rows: DataSourceType[]; count: number };
}
interface IPreferenceRequest {
  id?: string;
  word?: string;
  factors?: string;
  parent?: string;
  confidence?: number;
}
export interface IPreferenceResponse {
  ok: boolean;
  message: string;
  data: string;
}

type DataSourceType = {
  sn?: number;
  id: string;
  count?: number;
  word: string;
  factors?: string;
  parent?: string;
  confidence?: number;
  note?: string;
  created_at?: number;
  update_at?: number;
};
export interface IDictPreferenceEditorWidget {
  currPage?: number;
  pageSize?: number;
}
const DictPreferenceEditor = ({
  currPage,
  pageSize = 100,
}: IDictPreferenceEditorWidget) => {
  const [lookupWords, setLookupWords] = useState<string[]>([]);
  const [lookupRun, setLookupRun] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "序号",
      dataIndex: "sn",
      readonly: true,
    },
    {
      title: "数量",
      dataIndex: "count",
      tooltip: "在三藏中出现的次数",
      readonly: true,
    },
    {
      title: "词头",
      dataIndex: "word",
      readonly: true,
      width: "15%",
    },
    {
      title: "factors",
      key: "factors",
      dataIndex: "factors",
      render(dom, entity, index, action, schema) {
        const wbw: IWbw = {
          book: 1,
          para: 1,
          sn: [1],
          word: { value: entity.word, status: 5 },
          real: { value: entity.word, status: 5 },
          factors: { value: entity.factors ?? "", status: 5 },
          parent: { value: entity.parent ?? "", status: 5 },
          confidence: entity.confidence ?? 0,
        };
        return (
          <WbwFactorsEditor
            key="factors"
            initValue={wbw}
            display={"block"}
            onChange={async (e: string): Promise<IPreferenceResponse> => {
              console.log("factor change", e);
              const url = `/v2/dict-preference/${entity.id}`;
              const data: IPreferenceRequest = {
                factors: e,
                confidence: 100,
              };
              console.log("api request", url, data);
              return await put<IPreferenceRequest, IPreferenceResponse>(
                url,
                data
              );
            }}
          />
        );
      },
    },
    {
      title: "parent",
      dataIndex: "parent",
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || "", "title"]) === "不好玩") {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: "note",
      dataIndex: "note",
      valueType: "textarea",
    },
    {
      title: "信心指数",
      dataIndex: "confidence",
      valueType: "digit",
      render(dom, entity, index, action, schema) {
        return (
          <Progress
            size="small"
            percent={Math.round(entity.confidence ?? 0)}
            status={
              entity.confidence !== undefined && entity.confidence < 50
                ? "exception"
                : undefined
            }
          />
        );
      },
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      render: (text, record, _, action) => [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </Button>,
      ],
    },
  ];

  return (
    <div>
      <WbwLookup words={lookupWords} run={lookupRun} />
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="词典默认值"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        pagination={
          currPage
            ? false
            : {
                showQuickJumper: !currPage,
                showSizeChanger: !currPage,
                showLessItems: !currPage,
                showPrevNextJumpers: !currPage,
                current: 1,
                pageSize: 100,
              }
        }
        search={false}
        options={{
          search: true,
        }}
        recordCreatorProps={false}
        columns={columns}
        request={async (params = {}, sorter, filter) => {
          let url = `/v2/dict-preference`;
          const mPageSize = pageSize ?? params.pageSize ?? 100;
          const offset = ((currPage ?? params.current ?? 1) - 1) * mPageSize;
          url += `?limit=${mPageSize}&offset=${offset}`;
          url += params.keyword ? "&keyword=" + params.keyword : "";
          console.info("api request", url);
          const res = await get<IPreferenceListResponse>(url);
          console.info("api response", res);
          if (res.ok === false) {
          }
          return {
            data: res.data.rows.map((item, id) => {
              return {
                sn: id + offset + 1,
                id: item.id,
                count: item.count,
                word: item.word,
                factors: item.factors,
                parent: item.parent,
                confidence: item.confidence,
                note: item.note,
                created_at: item.created_at,
                update_at: item.update_at,
              };
            }),
            total: res.data.count,
            success: true,
          };
        }}
        onRow={(record) => {
          return {
            onMouseEnter: () => {
              console.info(`点击了行：${record.word}`);
              setLookupWords([record.word]);
              setLookupRun(true);
            },
            onMouseLeave: () => {
              setLookupRun(false);
            },
          };
        }}
        editable={{
          type: "single",
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            const url = `/v2/dict-preference/${data.id}`;
            console.log("api request", url, data);
            await put<IPreferenceRequest, IPreferenceResponse>(url, {
              factors: data.factors,
              parent: data.parent,
              confidence: 100,
            });
          },
          onChange: setEditableRowKeys,
        }}
      />
      ;
    </div>
  );
};
export default DictPreferenceEditor;
