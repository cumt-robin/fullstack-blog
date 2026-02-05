import React from "react";
import { styled } from "styled-components";

const BottomTipsWrapper = styled.div`
    text-align: center;
    overflow: hidden;

    .tips {
        position: relative;
        font-size: 12px;
        color: #999;
    }

    .tips--line {
        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 8px;
            width: 60px;
            height: 1px;
            background-color: #ccc;
        }

        &::before {
            left: -70px;
        }

        &::after {
            right: -70px;
        }
    }
`;

const BottomTips: React.FC<{
    content?: string;
    top?: string;
    bottom?: string;
    fontSize?: string;
    line?: boolean;
    children?: React.ReactNode;
}> = (props) => {
    const { content, top = "10px", bottom = "10px", fontSize, line = true, children } = props;

    return (
        <BottomTipsWrapper style={{ paddingTop: top, paddingBottom: bottom }}>
            <span className={line ? "tips tips--line" : "tips"} style={{ fontSize }}>
                {children || content}
            </span>
        </BottomTipsWrapper>
    );
};

export default BottomTips;
