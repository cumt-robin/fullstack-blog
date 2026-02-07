export function approvedFormatter(val: 0 | 1 | 2): string {
    switch (val) {
        case 1:
            return "通过";
        case 2:
            return "不通过";
        case 0:
        default:
            return "待审核";
    }
}
