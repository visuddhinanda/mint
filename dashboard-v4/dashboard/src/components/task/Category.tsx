import { Select } from "antd";

const Category = () => {
  return (
    <Select
      clearIcon={true}
      style={{ width: 180 }}
      bordered={false}
      placeholder={"任务类别"}
      onChange={(value: string) => {
        console.log(`selected ${value}`);
      }}
      options={[
        { value: "pedia", label: "百科" },
        { value: "vocabulary", label: "词汇表" },
        { value: "translate", label: "翻译" },
      ]}
    />
  );
};

export default Category;
