import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  Content,
  MergeableStore,
  OptionalSchemas,
} from "tinybase/with-schemas";
import { createClientPersister } from "./createClientPersister";

export const useCreateClientPersisterAndStart = <
  Schemas extends OptionalSchemas
>(
  storeId: string,
  store: MergeableStore<Schemas>,
  initialValues?: string,
  then?: () => void
) =>
  (UiReact as UiReact.WithSchemas<Schemas>).useCreatePersister(
    store,
    // Create the persister.
    (store: MergeableStore<Schemas>) => createClientPersister(storeId, store),
    [storeId],
    async (persister) => {
      // Determine if there is initial content for a newly-created store.
      let initialContent: Content<Schemas> | undefined = undefined;
      try {
        initialContent = [{}, JSON.parse(initialValues)];
      } catch {}

      // Start the persistence.
      await persister.load(initialContent);
      await persister.startAutoSave();
      then?.();
    },
    [initialValues]
  );
