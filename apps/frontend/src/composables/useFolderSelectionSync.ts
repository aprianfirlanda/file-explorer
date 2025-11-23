import { watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useFolderSelectionSync(selectedId: Ref<string | null>) {
  const route = useRoute();
  const router = useRouter();

  function updateUrlFolder(id: string | null) {
    router.replace({
      query: {
        ...route.query,
        folderId: id ?? undefined,
      },
    });
  }

  // URL → state
  watch(
    () => route.query.folderId as string | undefined,
    (folderId) => {
      if (folderId) {
        selectedId.value = folderId;
      } else {
        selectedId.value = null;
      }
    },
    { immediate: true }
  );

  // state → URL
  watch(
    () => selectedId.value,
    (id) => updateUrlFolder(id)
  );

  return { updateUrlFolder };
}
