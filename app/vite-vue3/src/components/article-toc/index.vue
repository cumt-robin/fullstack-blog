<template>
    <div class="toc-wrapper" v-if="treeData.length > 0" :style="{ top: `${topValue}px` }">
        <div class="toc-header">目录</div>
        <ul class="toc-list">
            <li
                v-for="item in treeData"
                :key="item.id"
                class="toc-item"
                :class="{ 'is-active': activeId === item.id }"
                :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
                @click="scrollToAnchor(item)"
            >
                {{ item.title }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
    outlines: {
        type: Array,
        default: () => [],
    },
});

const treeData = computed(() => {
    const list = props.outlines || [];
    if (list.length === 0) return [];

    const map = new Map();
    const roots = [];

    list.forEach((item) => {
        map.set(item.id, { ...item, children: [] });
    });

    list.forEach((item) => {
        const node = map.get(item.id);
        if (item.parent_id === null || item.parent_id === undefined) {
            roots.push(node);
        } else {
            const parent = map.get(item.parent_id);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    const flattenTree = (nodes, result = []) => {
        nodes.forEach((node) => {
            result.push(node);
            if (node.children && node.children.length > 0) {
                flattenTree(node.children, result);
            }
        });
        return result;
    };

    return flattenTree(roots);
});

const activeId = ref(null);

const INITIAL_TOP = 248;
const MIN_TOP = 48;

const topValue = ref(INITIAL_TOP);

const scrollToAnchor = (item) => {
    const element = document.getElementById(item.title);
    if (element) {
        const headerOffset = 20;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });

        activeId.value = item.id;
    }
};

const handleScroll = () => {
    const headings = treeData.value.map((item) => ({
        id: item.id,
        element: document.getElementById(item.title),
    }));

    let current = null;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.element) {
            const rect = heading.element.getBoundingClientRect();
            if (rect.top <= 100) {
                current = heading.id;
                break;
            }
        }
    }

    if (current !== null) {
        activeId.value = current;
    }

    const newTop = Math.max(MIN_TOP, INITIAL_TOP - scrollTop);
    topValue.value = newTop;
};

let scrollHandler = null;

onMounted(() => {
    scrollHandler = handleScroll;
    window.addEventListener("scroll", scrollHandler, { passive: true });
});

onBeforeUnmount(() => {
    if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
    }
});
</script>

<style lang="scss" scoped>
.toc-wrapper {
    position: sticky;
    right: 24px;
    width: 260px;
    flex-shrink: 0;
    max-height: calc(100vh - 120px);
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 16px;
    z-index: 10;
    display: none;

    @media screen and (width >= 992px) {
        display: block;
    }
}

.toc-header {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.toc-item {
    font-size: 14px;
    color: #666;
    padding: 8px 0;
    cursor: pointer;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: #1989fa;
    }

    &.is-active {
        color: #1989fa;
        font-weight: 500;
    }
}
</style>
