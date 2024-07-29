import { useEffect, useState } from "react";
import { ArticleDTO } from "@/bean/dto";
import { useAsyncLoading } from "@/hooks/async";
import { articleService } from "@/services/article";

const HotColumn: React.FC = () => {
    const [hotList, setHotList] = useState<ArticleDTO[]>([]);
    const handleGetHotList = async () => {
        const res = await articleService.topRead({
            count: 6,
        });
        setHotList(res.data);
    };

    const { trigger: getHotList, loading } = useAsyncLoading(handleGetHotList);

    useEffect(() => {
        getHotList();
    }, []);

    return <div className="wrapper">1</div>;
};

export default HotColumn;
