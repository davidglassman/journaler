import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const FocusParagraph = Extension.create({
  name: "focusParagraph",

  addOptions() {
    return {
      enabled: true
    };
  },

  onCreate() {
    if (this.options.enabled) {
      this.editor.view.dom.classList.add("focus-mode");
    } else {
      this.editor.view.dom.classList.remove("focus-mode");
    }
  },

  addCommands() {
    return {
      setFocusMode:
        (enabled) =>
        ({ editor }) => {
          this.options.enabled = enabled;

          if (enabled) {
            editor.view.dom.classList.add("focus-mode");
          } else {
            editor.view.dom.classList.remove("focus-mode");
          }

          editor.view.dispatch(editor.state.tr);

          return true;
        },
      toggleFocusMode:
        () =>
        ({ editor }) => {
          this.options.enabled = !this.options.enabled;

          if (this.options.enabled) {
            editor.view.dom.classList.add("focus-mode");
          } else {
            editor.view.dom.classList.remove("focus-mode");
          }

          editor.view.dispatch(editor.state.tr);

          return true;
        }
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("focusParagraph"),

        state: {
          init() {
            return DecorationSet.empty;
          },

          apply(tr, _oldState, _oldEditorState, _newEditorState) {
            if (!this.spec.options.enabled) {
              return DecorationSet.empty;
            }

            const { selection } = tr;
            const decorations = [];

            // Use $anchor instead of $from to always reference the original click position
            // This ensures the active line remains where the user originally clicked,
            // not where their cursor currently is during a drag selection
            const { $anchor } = selection;

            for (let i = $anchor.depth; i > 0; i--) {
              const node = $anchor.node(i);
              if (node.type.name === "paragraph") {
                const pos = $anchor.before(i);

                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: "active-paragraph"
                  })
                );
                break;
              }
            }

            return DecorationSet.create(tr.doc, decorations);
          }
        },

        props: {
          decorations(state) {
            return this.getState(state);
          }
        },

        options: this.options
      })
    ];
  }
});
