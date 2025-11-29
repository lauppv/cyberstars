import { EditorView } from "@codemirror/view";

const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1a103d", // fundal synthwave
      color: "#f8f8f2",           // text
      borderRadius: "8px",
    },
    ".cm-content": { caretColor: "#ff2cff" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#ff2cff" },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#00eaff55",
    },
    ".cm-gutters": {
      backgroundColor: "#12082c",
      color: "#7fe9ff",
      border: "none",
    },
  },
  { dark: true }
);

export default theme;
