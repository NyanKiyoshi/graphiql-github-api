import { useMonaco, useGraphiQLActions } from "@graphiql/react";
import React from "react";
import { GraphiQL } from "graphiql";

function App(props) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco?.monaco?.editor) {
      const editorWrapper = monaco.monaco.editor;

      for (const editor of editorWrapper.getEditors()) {
        console.log({
          editor,
          type: editor.getEditorType(),
        });

        // HACK: from:
        //  - https://github.com/microsoft/monaco-editor/issues/2177#issuecomment-1409962193
        //  - https://github.com/microsoft/monaco-editor/discussions/3666
        //  - https://github.com/microsoft/monaco-editor/issues/2316
        //  - https://github.com/microsoft/monaco-editor/issues/2241
        //
        //  An alternative could be to do this: https://github.com/swagger-api/swagger-editor/blob/8f4d7e85d35ef5b98cbf02b6a9727a08c97976e7/src/plugins/editor-monaco/monaco-contribution/index.js#L10-L12
        //  however it doesn't appear to work in here (?)
        //
        editor
          .getContribution("editor.contrib.suggestController")
          .widget.value._setDetailsVisible(true);
      }
    }
  }, [monaco]);

  return <GraphiQL {...props} />;
}

export default App;
