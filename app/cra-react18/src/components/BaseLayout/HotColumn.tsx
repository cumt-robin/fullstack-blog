import { PropsWithChildren } from "react";

interface HotColumnProps {
    open: boolean;
}

const HotColumn: React.FC<PropsWithChildren<HotColumnProps>> = ({ open, children }) => {
    return (
        <div className="wrapper">
            {open ? <div>HotColumn</div> : null}
            {children}
        </div>
    );
};

export default HotColumn;
