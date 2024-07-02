import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalUIState = defineStore("globalUIState", () => {
    const isMenuVisible = ref(false);

    const setIsMenuVisible = (value: boolean) => {
        isMenuVisible.value = value;
    };

    return {
        isMenuVisible,
        setIsMenuVisible,
    };
});
