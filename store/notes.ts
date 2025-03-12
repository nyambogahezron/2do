import { Store } from 'tinybase';
import { Note } from './models';

export const setupNoteModel = (store: Store): void => {
  // Ensure notes table exists
  if (!store.getTable('notes')) {
    store.setTable('notes', {});
  }
};

export const addNote = (
  store: Store,
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): string => {
  const id = Date.now().toString();
  const timestamp = Date.now();

  store.setRow('notes', id, {
    id,
    ...note,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return id;
};

export const updateNote = (
  store: Store,
  id: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt'>>
): void => {
  const note = store.getRow('notes', id);
  if (note) {
    store.setPartialRow('notes', id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }
};

export const deleteNote = (store: Store, id: string): void => {
  store.delRow('notes', id);
};

export const addImageToNote = (store: Store, noteId: string, imageUri: string): void => {
  const note = store.getRow('notes', noteId) as Note;
  if (note) {
    const images = [...(note.images || []), imageUri];
    store.setPartialRow('notes', noteId, {
      images,
      updatedAt: Date.now(),
    });
  }
};

export const removeImageFromNote = (store: Store, noteId: string, imageUri: string): void => {
  const note = store.getRow('notes', noteId) as Note;
  if (note && note.images) {
    const images = note.images.filter(uri => uri !== imageUri);
    store.setPartialRow('notes', noteId, {
      images,
      updatedAt: Date.now(),
    });
  }
};

export const addLinkToNote = (store: Store, noteId: string, link: string): void => {
  const note = store.getRow('notes', noteId) as Note;
  if (note) {
    const links = [...(note.links || []), link];
    store.setPartialRow('notes', noteId, {
      links,
      updatedAt: Date.now(),
    });
  }
};

export const removeLinkFromNote = (store: Store, noteId: string, link: string): void => {
  const note = store.getRow('notes', noteId) as Note;
  if (note && note.links) {
    const links = note.links.filter(l => l !== link);
    store.setPartialRow('notes', noteId, {
      links,
      updatedAt: Date.now(),
    });
  }
};

export const getNotesByCategory = (store: Store, categoryId: string): Record<string, Note> => {
  const notes = store.getTable('notes');
  if (!notes) return {};

  return Object.entries(notes).reduce((filtered, [id, note]) => {
    if (note.categoryId === categoryId) {
      filtered[id] = note as Note;
    }
    return filtered;
  }, {} as Record<string, Note>);
};

export const searchNotes = (store: Store, query: string): Record<string, Note> => {
  const notes = store.getTable('notes');
  if (!notes) return {};

  const lowerQuery = query.toLowerCase();
  return Object.entries(notes).reduce((filtered, [id, note]) => {
    if (
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    ) {
      filtered[id] = note as Note;
    }
    return filtered;
  }, {} as Record<string, Note>);
};
