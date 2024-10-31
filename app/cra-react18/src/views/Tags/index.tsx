import { useCallback, useEffect, useState } from "react";
import { Badge, Empty, Skeleton, Tag } from "antd";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { TagDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import BaseLayout from "@/components/BaseLayout";
import { tagService } from "@/services/tag";

const StyledTag = styled(Tag)`
    margin-top: 10px;
    padding: 4px 8px;
    font-size: 16px;
    cursor: pointer;
    > span {
        vertical-align: middle;
    }
    .ant-badge {
        margin-right: 6px;
    }
    .ant-badge-count {
        background: #348ba9;
    }
`;

const mainCss = css`
    padding: 24px 18px;
    background-color: #f5f5f5;
    @media screen and (min-width: 992px) {
        background-color: transparent;
    }
`;

export const Component: React.FC = () => {
    const [tagList, setTagList] = useState<TagDTO[]>([]);

    const handleGetTagList = useCallback(async () => {
        const { data } = await tagService.all({ getCount: "1" });
        setTagList(data);
    }, []);

    const { trigger: getTagList, loading } = useAsyncLoading(handleGetTagList);

    useEffect(() => {
        getTagList();
    }, [getTagList]);

    return (
        <BaseLayout mainCss={mainCss}>
            <h2 style={{ marginBottom: "16px", fontSize: "24px", textAlign: "center" }}>文章标签</h2>

            <Skeleton loading={loading} active={true} paragraph={{ rows: 12 }}>
                {tagList.length > 0 ? (
                    tagList.map((tag) => {
                        return (
                            <NavLink key={tag.id} to={`/tag/${encodeURIComponent(tag.tag_name)}`}>
                                <StyledTag icon={<Badge count={tag.tag_count}></Badge>}>{tag.tag_name}</StyledTag>
                            </NavLink>
                        );
                    })
                ) : (
                    <Empty />
                )}
            </Skeleton>
        </BaseLayout>
    );
};
