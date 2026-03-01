import { tree2Arr, TreeNode } from "./tree";

describe("tree", () => {
    describe("tree2Arr", () => {
        test("should convert simple tree to array", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                },
                {
                    key: "2",
                    name: "Node 2",
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("2");
        });

        test("should convert tree with children to array", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                        },
                        {
                            key: "1-2",
                            name: "Node 1-2",
                        },
                    ],
                },
                {
                    key: "2",
                    name: "Node 2",
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(4);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
            expect(result[2].key).toBe("1-2");
            expect(result[3].key).toBe("2");
        });

        test("should handle deeply nested tree", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                            children: [
                                {
                                    key: "1-1-1",
                                    name: "Node 1-1-1",
                                },
                            ],
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(3);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
            expect(result[2].key).toBe("1-1-1");
        });

        test("should handle tree with multiple levels of children", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                            children: [
                                {
                                    key: "1-1-1",
                                    name: "Node 1-1-1",
                                    children: [
                                        {
                                            key: "1-1-1-1",
                                            name: "Node 1-1-1-1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(4);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
            expect(result[2].key).toBe("1-1-1");
            expect(result[3].key).toBe("1-1-1-1");
        });

        test("should handle empty tree", () => {
            const tree: TreeNode[] = [];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(0);
        });

        test("should handle tree with empty children", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [],
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("1");
        });

        test("should handle custom children property name", () => {
            const tree = [
                {
                    key: "1",
                    name: "Node 1",
                    subItems: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree, "subItems");
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
        });

        test("should apply mapper function to each node", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree, "children", (node) => ({
                id: node.key,
                label: node.name,
            }));
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: "1", label: "Node 1" });
            expect(result[1]).toEqual({ id: "1-1", label: "Node 1-1" });
        });

        test("should handle mapper with index", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                },
                {
                    key: "2",
                    name: "Node 2",
                },
            ];
            const result = tree2Arr(tree, "children", (node, index) => ({
                key: node.key,
                index,
            }));
            expect(result).toHaveLength(2);
            expect(result[0].index).toBe(0);
            expect(result[1].index).toBe(1);
        });

        test("should handle complex tree structure", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                            children: [
                                {
                                    key: "1-1-1",
                                    name: "Node 1-1-1",
                                },
                                {
                                    key: "1-1-2",
                                    name: "Node 1-1-2",
                                },
                            ],
                        },
                        {
                            key: "1-2",
                            name: "Node 1-2",
                        },
                    ],
                },
                {
                    key: "2",
                    name: "Node 2",
                    children: [
                        {
                            key: "2-1",
                            name: "Node 2-1",
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(7);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
            expect(result[2].key).toBe("1-1-1");
            expect(result[3].key).toBe("1-1-2");
            expect(result[4].key).toBe("1-2");
            expect(result[5].key).toBe("2");
            expect(result[6].key).toBe("2-1");
        });

        test("should preserve node properties", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    value: 100,
                    active: true,
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                            value: 200,
                            active: false,
                        },
                    ],
                },
            ];
            const result = tree2Arr(tree);
            expect(result[0]).toEqual({
                key: "1",
                name: "Node 1",
                value: 100,
                active: true,
                children: [
                    {
                        key: "1-1",
                        name: "Node 1-1",
                        value: 200,
                        active: false,
                    },
                ],
            });
            expect(result[1]).toEqual({
                key: "1-1",
                name: "Node 1-1",
                value: 200,
                active: false,
            });
        });

        test("should handle tree with single node", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("1");
        });

        test("should handle tree with multiple root nodes", () => {
            const tree: TreeNode[] = [
                {
                    key: "1",
                    name: "Node 1",
                    children: [
                        {
                            key: "1-1",
                            name: "Node 1-1",
                        },
                    ],
                },
                {
                    key: "2",
                    name: "Node 2",
                    children: [
                        {
                            key: "2-1",
                            name: "Node 2-1",
                        },
                    ],
                },
                {
                    key: "3",
                    name: "Node 3",
                },
            ];
            const result = tree2Arr(tree);
            expect(result).toHaveLength(5);
            expect(result[0].key).toBe("1");
            expect(result[1].key).toBe("1-1");
            expect(result[2].key).toBe("2");
            expect(result[3].key).toBe("2-1");
            expect(result[4].key).toBe("3");
        });
    });
});
