import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type EditorViewState = {
  isOpen: boolean;
  url: string;
  documentId: number | null;
  wordFileId: number | null;
  inputUrl: string;
  outputUrl: string;
};

type StateType = {
  showFilters: boolean;
  editorView: EditorViewState;
};

const initialEditorView: EditorViewState = {
  isOpen: false,
  url: "",
  documentId: null,
  wordFileId: null,
  inputUrl: "",
  outputUrl: "",
};

const initialState: StateType = {
  showFilters: false,
  editorView: initialEditorView,
};

const letterSlice = createSlice({
  name: "letters",
  initialState,
  reducers: {
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },

    setEditorView: (state, action: PayloadAction<EditorViewState>) => {
      state.editorView = action.payload;
    },

    closeEditorView: (state) => {
      state.editorView = initialEditorView;
    },
  },
});

export const { toggleFilters, setEditorView, closeEditorView } =
  letterSlice.actions;

export default letterSlice.reducer;
