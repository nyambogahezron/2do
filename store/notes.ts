import { useState, useEffect } from 'react';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { getDb } from '@/lib/db';
import { notes, Note, InsertNote } from '@/db/schema';

/**
 * Get all notes from the database
 */
export const getAllNotes = async (): Promise<Note[]> => {
  const db = getDb();
  try {
    const allNotes = await db.select()
      .from(notes)
      .orderBy(desc(notes.updatedAt));
    return allNotes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (id: string): Promise<Note | null> => {
  const db = getDb();
  try {
    const result = await db.select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

/**
 * Add a new note
 */
export const addNote = async (
  noteData: Omit<InsertNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();

  try {
    await db.insert(notes).values({
      id,
      title: noteData.title || '',
      content: noteData.content || '',
      tags: noteData.tags || '[]',
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (
  id: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt'>>
): Promise<void> => {
  const db = getDb();
  const now = new Date().toISOString();

  try {
    await db.update(notes)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(notes.id, id));
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (id: string): Promise<void> => {
  const db = getDb();
  try {
    await db.delete(notes)
      .where(eq(notes.id, id));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

/**
 * React hook to get all notes
 */
export const useNotes = () => {
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const allNotes = await getAllNotes();
      setNotesList(allNotes);
    } catch (error) {
      console.error('Error refreshing notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    notes: notesList,
    loading,
    refresh,
  };
};

/**
 * React hook to get a single note by ID
 */
export const useNote = (id: string | null) => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!id) {
      setNote(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedNote = await getNoteById(id);
      setNote(fetchedNote);
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return {
    note,
    loading,
    refresh,
  };
};

/**
 * React hook for deleting a note
 */
export const useDeleteNote = () => {
  const [deleting, setDeleting] = useState(false);

  const remove = async (id: string) => {
    try {
      setDeleting(true);
      await deleteNote(id);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteNote: remove,
    deleting,
  };
};

/**
 * React hook for adding a note
 */
export const useAddNote = () => {
  const [adding, setAdding] = useState(false);

  const add = async (noteData: Omit<InsertNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setAdding(true);
      const id = await addNote(noteData);
      return id;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    } finally {
      setAdding(false);
    }
  };

  return add;
};

/**
 * React hook for updating a note
 */
export const useUpdateNote = () => {
  const [updating, setUpdating] = useState(false);

  const update = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      setUpdating(true);
      await updateNote(id, updates);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return update;
};
