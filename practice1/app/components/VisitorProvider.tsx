"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { STORAGE_KEYS, useStoredItem, writeItem } from "../lib/storage";
import BoltIcon from "./BoltIcon";
import Modal from "./Modal";

type Visitor = {
  /** undefined：還在讀取；null：沒填過 */
  name: string | null | undefined;
  /** 這次造訪才剛填名字 */
  isNew: boolean;
  editName: () => void;
};

const VisitorContext = createContext<Visitor>({
  name: undefined,
  isNew: false,
  editName: () => {},
});

export function useVisitor() {
  return useContext(VisitorContext);
}

export default function VisitorProvider({ children }: { children: ReactNode }) {
  const name = useStoredItem("local", STORAGE_KEYS.name);
  const skipped = useStoredItem("session", STORAGE_KEYS.skipName);
  const [isNew, setIsNew] = useState(false);
  const [editing, setEditing] = useState(false);

  // 第一次來、這個分頁也還沒按過略過，就請他輸入名字
  const open = (name === null && skipped === null) || editing;

  return (
    <VisitorContext.Provider value={{ name, isNew, editName: () => setEditing(true) }}>
      {children}
      <NameDialog
        open={open}
        currentName={name ?? ""}
        onSave={(value) => {
          writeItem("local", STORAGE_KEYS.name, value);
          setIsNew(true);
          setEditing(false);
        }}
        onClose={() => {
          if (!name) writeItem("session", STORAGE_KEYS.skipName, "1");
          setEditing(false);
        }}
      />
    </VisitorContext.Provider>
  );
}

function NameDialog({
  open,
  currentName,
  onSave,
  onClose,
}: {
  open: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [error, setError] = useState("");

  return (
    <Modal open={open} onClose={onClose} labelledBy="name-dialog-title">
      <BoltIcon className="h-12 w-12" />
      <p className="font-display mt-5 text-xs tracking-[0.3em] text-cyan">WELCOME TO DEALSTORM</p>
      <h2 id="name-dialog-title" className="mt-2 text-2xl font-black text-white">
        {currentName ? "要換個名字嗎？" : "嗨！該怎麼稱呼你？"}
      </h2>
      <p className="mt-2 text-sm text-white/55">名字只會存在你這台裝置的瀏覽器裡，下次來就會記得你。</p>

      <form
        className="mt-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const value = String(new FormData(e.currentTarget).get("name") ?? "").trim();
          if (!value) {
            setError("請輸入名字，或按「先略過」。");
            return;
          }
          setError("");
          onSave(value);
        }}
      >
        <label htmlFor="visitor-name" className="sr-only">
          你的名字
        </label>
        <input
          key={currentName}
          id="visitor-name"
          name="name"
          maxLength={20}
          defaultValue={currentName}
          placeholder="輸入你的暱稱"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "name-error" : undefined}
          className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan aria-[invalid]:border-rose-400"
        />
        {error && (
          <p id="name-error" className="mt-2 text-sm text-rose-400">
            {error}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="rgb-bg btn-shine flex-1 rounded-lg py-3 font-bold text-white"
          >
            {currentName ? "儲存" : "進入官網"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-5 py-3 text-white/70 transition hover:text-white"
          >
            {currentName ? "取消" : "先略過"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
