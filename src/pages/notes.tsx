import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import H1 from "../components/Heading1";
import NoteCard from "../components/NoteCard";
import ViewNote from "../components/ViewNote";
import ProtectedPage from "../components/ProtectedPage";
import { supabase } from "../lib/supabaseClient";
import { useWedding } from "../lib/WeddingContext";
import { Note } from "../types/note";

function NotesContent() {
  const { wedding, isEditor } = useWedding();
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!wedding) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data as Note[]);
    else if (error) console.error("Error fetching notes:", error);
  }, [wedding]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  return (
    <div className="relative p-8 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-200 inline-block">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <H1>Shared Notes</H1>
        <div className="w-6" />
      </div>

      {!isEditor && (
        <p className="text-center text-sm text-gray-500 mb-4 italic">
          You have view-only access — only the couple can create or edit notes.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full text-center">No notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} onClick={() => setViewingNote(note)}>
            <NoteCard note={note} />
          </div>
        ))}
      </div>

      {isEditor && (
        <Link
          href="/create-note"
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-6 h-6" />
        </Link>
      )}

      {viewingNote && (
        <ViewNote
          note={viewingNote}
          canEdit={isEditor}
          onClose={() => setViewingNote(null)}
          onSave={fetchNotes}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedPage>
      <NotesContent />
    </ProtectedPage>
  );
}
