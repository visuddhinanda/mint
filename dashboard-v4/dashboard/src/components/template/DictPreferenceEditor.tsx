import DictPreferenceEditor, {
  IDictPreferenceEditorWidget,
} from "../dict/DictPreferenceEditor";

interface IWidgetTerm {
  props: string;
}
const DictPreferenceEditorWidget = ({ props }: IWidgetTerm) => {
  const prop = JSON.parse(atob(props)) as IDictPreferenceEditorWidget;
  return <DictPreferenceEditor {...prop} />;
};

export default DictPreferenceEditorWidget;
