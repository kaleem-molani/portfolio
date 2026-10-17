import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

// Define a light custom theme (parchment/cream background, soft mono)
const customParchmentTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#F3ECE0", // parchment
    color: "#2B2622" // ink
  },
  ".cm-scroller": {
    fontFamily: "monospace !important",
    lineHeight: "1.6 !important",
    padding: "16px !important"
  },
  ".cm-content": {
    caretColor: "#C8643C", // terracotta
  },
  "&.cm-focused": {
    outline: "none !important"
  },
  ".cm-gutters": {
    backgroundColor: "#F3ECE0",
    color: "#6B5E52",
    border: "none"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(200, 100, 60, 0.05)" // light terracotta tint
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(200, 100, 60, 0.05)"
  }
});

export interface EditorControls {
  view: EditorView;
  getDoc: () => string;
  setDoc: (doc: string) => void;
}

export function initializeEditor(
  parent: HTMLElement,
  initialContent: string,
  onChange: (doc: string) => void
): EditorControls {
  const startState = EditorState.create({
    doc: initialContent,
    extensions: [
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      markdown(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.lineWrapping,
      customParchmentTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      })
    ]
  });

  const view = new EditorView({
    state: startState,
    parent
  });

  return {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc: (doc: string) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: doc }
      });
    }
  };
}
