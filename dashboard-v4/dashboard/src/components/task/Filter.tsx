import { Button, Popover, Select, Space, Typography } from "antd";
import { IFilter } from "./TaskList";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import UserSelect from "../template/UserSelect";
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
} from "@ant-design/pro-components";
import { DeleteOutlined, FilterOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface IProps {
  item: IFilter;
  sn: number;
  onRemove?: () => void;
}
const FilterItem = ({ item, sn, onRemove }: IProps) => {
  const intl = useIntl();
  return (
    <ProForm.Group>
      <Text>{sn === 0 ? "当" : "且"}</Text>
      <ProFormSelect
        initialValue={item.field}
        name={`field_${sn}`}
        style={{ width: 120 }}
        options={[
          {
            value: "executor_id",
            label: intl.formatMessage({ id: "forms.fields.executor.label" }),
          },
          {
            value: "assignees_id",
            label: intl.formatMessage({ id: "forms.fields.assignees.label" }),
          },
          {
            value: "participants_id",
            label: intl.formatMessage({ id: "labels.participants" }),
          },
        ]}
      />
      <ProFormSelect
        initialValue={item.operator}
        name={`operator_${sn}`}
        style={{ width: 120 }}
        options={[
          {
            value: "includes",
            label: "包含",
          },
          {
            value: "not-includes",
            label: "不包含",
          },
        ]}
      />
      <UserSelect
        name={"value_" + sn}
        multiple={true}
        initialValue={item.value}
        required={false}
        hiddenTitle
      />
      <Button type="link" icon={<DeleteOutlined />} danger onClick={onRemove} />
    </ProForm.Group>
  );
};

interface IWidget {
  initValue?: IFilter[];
  onChange?: (value: IFilter[]) => void;
}
const Filter = ({ initValue, onChange }: IWidget) => {
  const [filterList, setFilterList] = useState(initValue ?? []);
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  return (
    <Popover
      placement="bottomLeft"
      trigger={"click"}
      arrowPointAtCenter
      title={intl.formatMessage({ id: "labels.filter" })}
      content={
        <div style={{ width: 750 }}>
          <ProForm
            formRef={formRef}
            submitter={{
              render(props, dom) {
                return [
                  <Button
                    onClick={() => {
                      setFilterList((origin) => {
                        return [
                          ...origin,
                          {
                            field: "executor_id",
                            operator: "includes",
                            value: [],
                          },
                        ];
                      });
                    }}
                  >
                    添加条件
                  </Button>,
                  ...dom,
                ];
              },
            }}
            onFinish={async () => {
              const value = formRef.current?.getFieldsValue();
              console.log(value);
              let counter = 0;
              let newValue: IFilter[] = [];
              while (counter < Object.keys(value).length) {
                const field = `field_${counter}`;
                const field2 = `operator_${counter}`;
                const field3 = `value_${counter}`;
                if (value.hasOwnProperty(field)) {
                  newValue.push({
                    field: value[field],
                    operator: value[field2],
                    value: value[field3],
                  });
                }
                counter++;
              }
              console.log(newValue);
              if (onChange) {
                onChange(newValue);
              }
            }}
          >
            {filterList.map((item, id) => {
              return (
                <FilterItem
                  item={item}
                  key={id}
                  sn={id}
                  onRemove={() => {
                    setFilterList((origin) => {
                      return origin.filter(
                        (value, index: number) => index !== id
                      );
                    });
                  }}
                />
              );
            })}
          </ProForm>
        </div>
      }
    >
      <Button
        type={filterList.length === 0 ? "text" : "primary"}
        icon={<FilterOutlined />}
      >
        筛选 {filterList.length}
      </Button>
    </Popover>
  );
};

export default Filter;
