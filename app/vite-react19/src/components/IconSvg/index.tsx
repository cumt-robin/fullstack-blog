import { createFromIconfontCN } from "@ant-design/icons";
import { useMemo } from "react";
import styled, { css as styledCss } from "styled-components";
import { isNumber } from "@/utils/type";

const Icon = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1570300_zwupv8bc2lp.js",
});

const iconPrefix = "icon-";
const fallbackIcon = "home";

interface IconSvgProps {
    icon: string;
    size?: number;
    color?: string;
    css?: ReturnType<typeof styledCss>;
}

type ExtraProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof IconSvgProps>;

const IconSvg: React.FC<IconSvgProps & ExtraProps> = ({ icon, ...restAttrs }) => {
    const iconType = useMemo(() => `${iconPrefix}${icon || fallbackIcon}`, [icon]);
    return <Icon type={iconType} {...restAttrs} />;
};

const StyledIconSvg = styled(IconSvg)<IconSvgProps>`
    font-size: ${(props) => (isNumber(props.size) ? `${props.size}px` : "1em")};
    color: ${(props) => props.color};
    & + & {
        margin-left: 10px;
    }
    ${(props) => props.css}
`;

export default StyledIconSvg;
