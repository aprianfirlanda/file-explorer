import { onMounted, onBeforeUnmount } from "vue";

export function useGlobalClickClose(handler: () => void) {
  function onClick() {
    handler();
  }

  onMounted(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", onClick);
    }
  });

  onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", onClick);
    }
  });
}
