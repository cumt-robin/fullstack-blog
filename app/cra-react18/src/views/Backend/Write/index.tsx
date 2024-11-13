import marked from "marked";
import mermaid from "mermaid";
// hljs 按需加载
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import yaml from "highlight.js/lib/languages/yaml";
// 皮肤
import "highlight.js/styles/atom-one-dark.css";
import DOMPurify from "dompurify";
import { throttle, debounce } from "lodash-es";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AutoComplete, Button, Checkbox, Col, Form, Image, Input, message, Modal, Radio, Row, Spin } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { categoryService } from "@/services/category";
import { articleService } from "@/services/article";
import { tagService } from "@/services/tag";
import "@/styles/md.less";
import { useAsyncLoading } from "@/hooks/async";
import { sleep } from "@/utils/bom";
import { REQUIRED_VALIDATOR_BLUR } from "@/utils/validator";
import { ArticleDTO, CategoryDTO } from "@/bean/dto";
import { useAppSelector } from "@/store/hooks";
import { selectUserInfo } from "@/store/slices/auth";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("yaml", yaml);

interface NewTagDTO {
    value: string;
}

interface RelationFormInitialValues {
    newTags: string[];
    oldCategoryIds: number[];
    newCategorys: string[];
}

const Wrapper = styled.section`
    background-color: #fff;
    padding: 20px;
    min-width: 1400px;

    .input-simple {
        max-width: 640px;
    }

    .md-textarea,
    .md-preview {
        height: 860px;
        padding: 16px 20px;
    }

    .md-textarea {
        resize: none;
    }

    .md-preview {
        border: 1px solid #d9d9d9;
        overflow: auto;
    }
`;

const Poster = styled(Image)`
    max-width: 640px;
`;

export const Component = () => {
    const params = useParams();

    const [isEdit, setIsEdit] = useState(false);

    const [form] = Form.useForm();

    const [relationForm] = Form.useForm();

    const posterValue = Form.useWatch("poster", form);

    const [purifiedContent, setPurifiedContent] = useState("");

    const [isRelationVisible, setIsRelationVisible] = useState(false);

    const [tagOptions, setTagOptions] = useState<NewTagDTO[]>([]);

    const [categoryWd, setCategoryWd] = useState("");

    const [categorys, setCategorys] = useState<CategoryDTO[]>([]);
    const [allCategorys, setAllCategorys] = useState<CategoryDTO[]>([]);
    const [articleDetail, setArticleDetail] = useState<ArticleDTO | null>(null);
    const [relationFormInitialValues, setRelationFormInitialValues] = useState<RelationFormInitialValues>({
        newTags: [],
        newCategorys: [],
        oldCategoryIds: [],
    });

    const visibleCategorys = useMemo(() => {
        return categoryWd ? categorys : allCategorys;
    }, [categoryWd, categorys, allCategorys]);
    const categoryNames = useMemo(() => {
        return allCategorys.map((item) => item.category_name);
    }, [allCategorys]);
    const originalTagNames = useMemo(() => {
        return articleDetail?.tags.map((item) => item.tagName) || [];
    }, [articleDetail]);
    const originalCategoryIds = useMemo(() => {
        return articleDetail?.categories.map((item) => item.id) || [];
    }, [articleDetail]);

    const userInfo = useAppSelector(selectUserInfo);

    const navigate = useNavigate();

    const handleEditInit = async () => {
        setIsEdit(true);
        const { data } = await articleService.detail(Number(params.id));
        setArticleDetail(data);
        form.setFieldsValue({
            articleTitle: data.article_name,
            articleText: data.article_text,
            poster: data.poster,
            summary: data.summary,
            private: data.private,
        });
        // 渲染markdown
        if (data.article_text) {
            const markedContent = marked(data.article_text);
            setPurifiedContent(DOMPurify.sanitize(markedContent));
        }

        const relValues: Partial<RelationFormInitialValues> = {};
        // 处理标签
        if (data.tags.length > 0) {
            relValues.newTags = data.tags.map((item) => item.tagName);
        }
        // 处理分类
        if (data.categories.length > 0) {
            relValues.oldCategoryIds = data.categories.map((item) => item.id);
        }
        setRelationFormInitialValues((prev) => ({ ...prev, ...relValues }));

        await sleep(0);
        mermaid.run();
    };

    const { loading: initLoading, trigger: triggerEditInit } = useAsyncLoading(handleEditInit);

    const getAllCategorys = async () => {
        const { data } = await categoryService.all();
        setAllCategorys(data);
    };

    const handleSearchCategory = async (newCategoryWd: string) => {
        const { data } = await categoryService.fuzzy({
            wd: newCategoryWd,
        });
        setCategorys(data);
    };

    const { loading: categorySearchLoading, trigger: searchCategory } = useAsyncLoading(handleSearchCategory, [allCategorys]);

    const debounceSearchCategory = debounce(searchCategory, 500, { trailing: true });

    useEffect(() => {
        if (params.id) {
            triggerEditInit();
        }
        const initMarked = () => {
            const renderer = new marked.Renderer();
            renderer.link = function customLink(href, _title, text) {
                return `<a class="link" href="${href}" target="_blank" rel="nofollow" title="${text}">${text}</a>`;
            };
            renderer.image = function customImage(href, _title, text) {
                return (
                    `<a class="img-wrapper" href="${href}" target="_blank" rel="nofollow" title="${text}">` +
                    `<img src="${href}" alt="${text}">` +
                    "</a>"
                );
            };
            renderer.code = function customCode(code, language) {
                if (language === "mermaid") {
                    return `<div class="mermaid">${code}</div>`;
                }
                return `<pre><code>${code}</code></pre>`;
            };
            marked.setOptions({
                renderer,
                highlight(code, lang) {
                    return hljs.highlight(code, { language: lang }).value;
                },
                // 只解析符合markdown.pl定义的，不修正markdown的错误
                pedantic: false,
                // 启动Github样式的Markdown
                gfm: true,
                // 支持Github换行符，必须打开gfm选项
                breaks: false,
                // deprecated，应该自己使用sanitize库
                sanitize: false,
                // 优化列表输出
                smartLists: true,
                smartypants: false,
                xhtml: false,
            });
        };
        initMarked();
        mermaid.initialize({
            theme: "default",
            startOnLoad: false,
        });
        getAllCategorys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (categoryWd) {
            debounceSearchCategory(categoryWd);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryWd]);

    const handleRenderMdContent = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        const markedContent = marked(content);
        setPurifiedContent(DOMPurify.sanitize(markedContent));
        await sleep(0);
        mermaid.run();
    };

    const onMdContentChange = throttle(handleRenderMdContent, 300);

    const handleSearchTag = async (value: string) => {
        if (value) {
            const { data } = await tagService.fuzzy({
                wd: value,
            });
            setTagOptions(data.map((item) => ({ value: item.tag_name })));
        } else {
            setTagOptions([]);
        }
    };

    const { trigger: searchTag } = useAsyncLoading(handleSearchTag);

    const debounceSearchTag = debounce(searchTag, 500);

    const onSearchTag = (value: string) => {
        debounceSearchTag(value);
    };

    const handleConfirmPublish = async (values: { newTags: string[]; newCategorys: string[]; oldCategoryIds: number[] }) => {
        const { newTags = [], newCategorys = [], oldCategoryIds = [] } = values;
        // 计算出所有的标签名
        const tagNames = newTags.filter((item) => item.trim() !== "").map((item) => item.trim());
        if (tagNames.length === 0) {
            message.warning("至少输入一个标签");
            return Promise.reject(false);
        }

        // 计算出输入的新的分类名
        const newCategoryNames = newCategorys.filter((item) => item.trim() !== "").map((item) => item.trim());
        // 和旧的分类名categoryNames做对比，存在重复则提示
        let isRepeatCategoryName = false;
        let repeatCategoryName = "";
        for (let index = 0, len = newCategoryNames.length; index < len; index++) {
            const categoryName = newCategoryNames[index];
            if (categoryNames.includes(categoryName)) {
                isRepeatCategoryName = true;
                repeatCategoryName = categoryName;
                break;
            }
        }
        if (isRepeatCategoryName) {
            message.warning(`新增的分类名称[${repeatCategoryName}]已经存在，请删除后直接在已有分类中选择`);
            return Promise.reject(false);
        }
        // 如果没有新增分类，也没有勾选已有分类
        if (newCategoryNames.length === 0 && oldCategoryIds.length === 0) {
            message.warning("至少选择一个分类");
            return Promise.reject(false);
        }
        // 校验通过，开始提交表单
        if (isEdit) {
            // 编辑场景
            // 处理要删除的tag关系，即开始有，现在没有的那部分tag
            const deleteTagIDs = (articleDetail as ArticleDTO).tags.filter((tag) => !tagNames.includes(tag.tagName)).map((tag) => tag.id);
            // 处理要新增的tag关系，即现在有，开始没有的那部分tag
            const newTags = tagNames.filter((tagName) => !originalTagNames.includes(tagName));

            // 处理要删除的分类关系，即开始有，现在没有的那部分分类
            const deleteCategoryIDs = (articleDetail as ArticleDTO).categories
                .filter((category) => !oldCategoryIds.includes(category.id))
                .map((category) => category.id);

            // 需要新增的分类关系，依然放在 newCategories 中

            // relatedCategoryIDs 存放的是需要新关联的分类关系，即现在勾选了，而开始没勾选的分类
            const relatedCategoryIDs = oldCategoryIds.filter((categoryId) => !originalCategoryIds.includes(categoryId));

            const params = {
                id: articleDetail?.id,
                ...form.getFieldsValue(),
                deleteTagIDs: deleteTagIDs.length > 0 ? deleteTagIDs : null,
                newTags: newTags.length > 0 ? newTags : null,
                deleteCategoryIDs: deleteCategoryIDs.length > 0 ? deleteCategoryIDs : null,
                newCategories: newCategoryNames.length > 0 ? newCategoryNames : null,
                relatedCategoryIDs: relatedCategoryIDs.length > 0 ? relatedCategoryIDs : null,
            };
            await articleService.update(params);
            message.success("保存成功");
        } else {
            // 发布场景
            const params = {
                authorId: userInfo?.id,
                ...form.getFieldsValue(),
                oldCategoryIds: oldCategoryIds.length > 0 ? oldCategoryIds : null,
                tags: tagNames,
                newCategories: newCategoryNames.length > 0 ? newCategoryNames : null,
            };
            await articleService.add(params);
            message.success("发布成功");
        }

        navigate("/backend/article", { replace: true });
    };

    const { trigger: onConfirmPublish, loading: isConfirmLoading } = useAsyncLoading(handleConfirmPublish, [categoryNames]);

    return (
        <Wrapper>
            <Spin spinning={initLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    wrapperCol={{ span: 24 }}
                    initialValues={{ private: 0 }}
                    scrollToFirstError={{ behavior: "instant", block: "end" }}
                    onFinish={() => setIsRelationVisible(true)}
                >
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEdit ? "保存博客" : "发布博客"}
                        </Button>
                    </Form.Item>
                    <Form.Item label="封面url">
                        <Form.Item name="poster" rules={[REQUIRED_VALIDATOR_BLUR]}>
                            <Input className="input-simple" placeholder="暂时使用在线图片URL，比如七牛云等云存储地址" />
                        </Form.Item>
                        {posterValue && <Poster src={posterValue} />}
                    </Form.Item>
                    <Form.Item name="articleTitle" label="文章标题" rules={[REQUIRED_VALIDATOR_BLUR]}>
                        <Input className="input-simple" placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item name="summary" label="文章摘要" rules={[REQUIRED_VALIDATOR_BLUR]}>
                        <Input.TextArea className="input-simple" placeholder="请输入文章摘要" autoSize={{ minRows: 2, maxRows: 4 }} />
                    </Form.Item>
                    <Form.Item name="private" label="是否私密">
                        <Radio.Group>
                            <Radio value={0}>否</Radio>
                            <Radio value={1}>是</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="正文部分" rules={[REQUIRED_VALIDATOR_BLUR]}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item name="articleText" rules={[REQUIRED_VALIDATOR_BLUR]}>
                                    <Input.TextArea
                                        className="md-textarea"
                                        placeholder="请输入markdown格式的正文"
                                        onChange={onMdContentChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <section className="md-preview" dangerouslySetInnerHTML={{ __html: purifiedContent }} />
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Spin>
            <Modal title="关联分类/标签" open={isRelationVisible} footer={null} width="860px" onCancel={() => setIsRelationVisible(false)}>
                <Form
                    form={relationForm}
                    layout="vertical"
                    wrapperCol={{ span: 24 }}
                    initialValues={relationFormInitialValues}
                    onFinish={onConfirmPublish}
                >
                    <Form.Item label="文章标签">
                        <Form.List
                            name="newTags"
                            rules={[
                                {
                                    validator: async (_, newTags) => {
                                        if (!newTags || newTags.length < 1) {
                                            return Promise.reject(new Error("最少输入一个标签"));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => {
                                return (
                                    <Row gutter={16} style={{ lineHeight: 2 }}>
                                        {fields.map((field) => (
                                            <Col key={field.key} xs={8} sm={4}>
                                                <Form.Item {...field} key={field.key} noStyle>
                                                    <AutoComplete
                                                        options={tagOptions}
                                                        onFocus={() => setTagOptions([])}
                                                        onSearch={onSearchTag}
                                                    />
                                                </Form.Item>
                                                <DeleteOutlined onClick={() => remove(field.name)} />
                                            </Col>
                                        ))}
                                        <Col span={4}>
                                            <Form.Item noStyle>
                                                <PlusOutlined onClick={() => add("")} />
                                                <Form.ErrorList errors={errors} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                );
                            }}
                        </Form.List>
                    </Form.Item>

                    <Form.Item label="新增分类">
                        <Form.List name="newCategorys">
                            {(fields, { add, remove }) => {
                                return (
                                    <Row gutter={16} style={{ lineHeight: 2 }}>
                                        {fields.map((field) => (
                                            <Col key={field.key} xs={8} sm={4}>
                                                <Form.Item {...field} key={field.key} noStyle>
                                                    <Input />
                                                </Form.Item>
                                                <DeleteOutlined onClick={() => remove(field.name)} />
                                            </Col>
                                        ))}
                                        <Col span={4}>
                                            <PlusOutlined onClick={() => add("")} />
                                        </Col>
                                    </Row>
                                );
                            }}
                        </Form.List>
                    </Form.Item>

                    <Form.Item label="已有分类">
                        <div>
                            <Input.Search
                                placeholder="模糊搜索"
                                value={categoryWd}
                                loading={categorySearchLoading}
                                onChange={(e) => setCategoryWd(e.target.value)}
                                style={{ width: "256px" }}
                            />

                            <Form.Item name="oldCategoryIds">
                                <Checkbox.Group style={{ width: "100%", marginTop: "8px" }}>
                                    <Row gutter={16}>
                                        {visibleCategorys.map((category) => (
                                            <Col key={category.id} xs={8} sm={4}>
                                                <Checkbox value={category.id}>{category.category_name}</Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item className="text-center">
                        <Button type="primary" htmlType="submit" loading={isConfirmLoading}>
                            {isEdit ? "保存博客" : "发布博客"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Wrapper>
    );
};
