import { useEffect, useState } from "react";
import { get } from "../../request";
import {  ITaskData, ITaskListResponse } from "../api/task";

import "../article/article.css";

import Mermaid from "../general/Mermaid";

interface IWidget {
  projectId?: string;
  tasks?:ITaskData[];
}
const TaskRelation = ({ tasks }: IWidget) => {

  let mermaidText = "flowchart LR\n";

  //节点样式
  const color = [
    { status: "pending", fill: "white" },
    { status: "published", fill: "orange" },
    { status: "running", fill: "green" },
    { status: "done", fill: "blue" },
    { status: "restarted", fill: "red" },
    { status: "closed", fill: "yellow" },
    { status: "canceled", fill: "gray" },
    { status: "expired", fill: "brown" },
  ];

  color.forEach((value) => {
    mermaidText += `classDef ${value.status} fill:${value.fill},stroke:#333,stroke-width:2px;\n`;
  });

  tasks?.forEach((task: ITaskData, index: number, array: ITaskData[]) => {
    //输出节点
    mermaidText += `${task.id}[${task.title}]:::${task.status};\n`;

    //输出带有子任务的节点
    const children = array.filter(
      (value: ITaskData, index: number, array: ITaskData[]) => {
        return value.parent_id === task.id;
      }
    );
    if (children.length > 0) {
      mermaidText += `subgraph ${task.id} ["${task.title}"]\n`;
      mermaidText += `${children.map((task) => task.id).join(`;\n`)}`;
      mermaidText += ";\nend\n";
    }

    //关系线
    if (task.pre_task) {
      mermaidText += `${task.pre_task.id} --> ${task.id};\n`;
    }
    if (task.next_task) {
      mermaidText += `${task.id} --> ${task.next_task.id};\n`;
    }
  });

  console.debug(mermaidText);

  return (
    <div>
      <Mermaid text={mermaidText} />
    </div>
  );
};

export default TaskRelation;
