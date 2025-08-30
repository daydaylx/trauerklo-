import { Link } from "react-router-dom";
import { Editor } from "../features/customize/Editor";

export function EditorRoute() {
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Editor</h1>
        <nav className="flex gap-3 text-sm">
          <Link to="/" className="underline">Chat</Link>
          <Link to="/settings" className="underline">Einstellungen</Link>
        </nav>
      </header>
      <Editor />
    </div>
  );
}
