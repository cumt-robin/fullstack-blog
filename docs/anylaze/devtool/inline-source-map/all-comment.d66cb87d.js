(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
    ["all-comment"],
    {
        "333a": function (e, t, n) {
            "use strict";
            n("8f7a");
        },
        "40ef": function (e, t, n) {
            "use strict";
            function a(e) {
                switch (e) {
                    case 1:
                        return "通过";
                    case 2:
                        return "不通过";
                    case 0:
                    default:
                        return "待审核";
                }
            }
            n.d(t, "a", function () {
                return a;
            });
        },
        "8f7a": function (e, t, n) {},
        c73e: function (e, t, n) {
            "use strict";
            n.r(t);
            var a = n("7a23"),
                r = Object(a["withScopeId"])("data-v-6dec5e60");
            Object(a["pushScopeId"])("data-v-6dec5e60");
            var c = { class: "admin-page-wrapper" },
                i = Object(a["createTextVNode"])("物理删除");
            Object(a["popScopeId"])();
            var o = r(function (e, t) {
                    var n = Object(a["resolveComponent"])("a-button"),
                        o = Object(a["resolveComponent"])("a-space"),
                        u = Object(a["resolveComponent"])("a-table");
                    return (
                        Object(a["openBlock"])(),
                        Object(a["createBlock"])("section", c, [
                            Object(a["createVNode"])(
                                u,
                                {
                                    "row-key": "id",
                                    "data-source": e.commentList,
                                    columns: e.columns,
                                    loading: e.loading,
                                    scroll: { x: 1500 },
                                    pagination: e.pagination,
                                },
                                {
                                    action: r(function (t) {
                                        var c = t.record;
                                        return [
                                            Object(a["createVNode"])(
                                                o,
                                                null,
                                                {
                                                    default: r(function () {
                                                        return [
                                                            Object(a["createVNode"])(
                                                                n,
                                                                {
                                                                    size: "small",
                                                                    type: 1 == c.deleted ? "primary" : "danger",
                                                                    ghost: "",
                                                                    onClick: function (t) {
                                                                        return e.onClickLogicDel(c);
                                                                    },
                                                                },
                                                                {
                                                                    default: r(function () {
                                                                        return [
                                                                            Object(a["createTextVNode"])(
                                                                                Object(a["toDisplayString"])(
                                                                                    1 == c.deleted ? "逻辑恢复" : "逻辑删除"
                                                                                ),
                                                                                1
                                                                            ),
                                                                        ];
                                                                    }),
                                                                    _: 2,
                                                                },
                                                                1032,
                                                                ["type", "onClick"]
                                                            ),
                                                            Object(a["createVNode"])(
                                                                n,
                                                                {
                                                                    size: "small",
                                                                    type: "danger",
                                                                    ghost: "",
                                                                    onClick: function (t) {
                                                                        return e.onClickDel(c);
                                                                    },
                                                                },
                                                                {
                                                                    default: r(function () {
                                                                        return [i];
                                                                    }),
                                                                    _: 2,
                                                                },
                                                                1032,
                                                                ["onClick"]
                                                            ),
                                                        ];
                                                    }),
                                                    _: 2,
                                                },
                                                1024
                                            ),
                                        ];
                                    }),
                                    _: 1,
                                },
                                8,
                                ["data-source", "columns", "loading", "pagination"]
                            ),
                        ])
                    );
                }),
                u = (n("5e1c"), n("5c5f")),
                d = (n("3b18"), n("f64c")),
                l = (n("cd17"), n("ed3b")),
                s = n("1da1"),
                p = (n("d3b7"), n("96cf"), n("6c02")),
                f = n("01d4"),
                m = n("d04f"),
                v = n("a490"),
                b = n("40ef"),
                g = n("df62"),
                h = n.n(g);
            function O(e) {
                return "function" === typeof e || ("[object Object]" === Object.prototype.toString.call(e) && !Object(a["isVNode"])(e));
            }
            var j = Object(a["defineComponent"])({
                name: "AllMessage",
                setup: function () {
                    var e = Object(a["ref"])([]),
                        t = Object(a["reactive"])({
                            current: 1,
                            pageSize: 10,
                            total: 0,
                            showTotal: function (e) {
                                return "共计".concat(e, "条");
                            },
                            onChange: function (e) {
                                (t.current = e), c();
                            },
                        }),
                        n = (function () {
                            var n = Object(s["a"])(
                                regeneratorRuntime.mark(function n() {
                                    var a;
                                    return regeneratorRuntime.wrap(function (n) {
                                        while (1)
                                            switch ((n.prev = n.next)) {
                                                case 0:
                                                    return (
                                                        (n.next = 2), m["a"].pageAdmin({ pageNo: t.current, pageSize: t.pageSize, type: 1 })
                                                    );
                                                case 2:
                                                    (a = n.sent), (e.value = a.data), (t.total = a.total);
                                                case 5:
                                                case "end":
                                                    return n.stop();
                                            }
                                    }, n);
                                })
                            );
                            return function () {
                                return n.apply(this, arguments);
                            };
                        })(),
                        r = Object(f["a"])(n),
                        c = r.trigger,
                        i = r.loading;
                    c();
                    var o = function (e) {
                            var t = 1 === e.deleted;
                            l["a"].confirm({
                                title: "确认要执行".concat(t ? "逻辑恢复" : "逻辑删除", "吗？"),
                                onOk: (function () {
                                    var n = Object(s["a"])(
                                        regeneratorRuntime.mark(function n() {
                                            return regeneratorRuntime.wrap(function (n) {
                                                while (1)
                                                    switch ((n.prev = n.next)) {
                                                        case 0:
                                                            return (n.next = 2), m["a"].update({ id: e.id, deleted: t ? 0 : 1 });
                                                        case 2:
                                                            d["a"].success("操作成功"), c();
                                                        case 4:
                                                        case "end":
                                                            return n.stop();
                                                    }
                                            }, n);
                                        })
                                    );
                                    function a() {
                                        return n.apply(this, arguments);
                                    }
                                    return a;
                                })(),
                            });
                        },
                        g = function (e) {
                            l["a"].confirm({
                                title: "确认要删除吗？",
                                onOk: (function () {
                                    var n = Object(s["a"])(
                                        regeneratorRuntime.mark(function n() {
                                            return regeneratorRuntime.wrap(function (n) {
                                                while (1)
                                                    switch ((n.prev = n.next)) {
                                                        case 0:
                                                            return (n.next = 2), m["a"].delete(e.id);
                                                        case 2:
                                                            d["a"].success("操作成功"), (t.current = 1), c();
                                                        case 5:
                                                        case "end":
                                                            return n.stop();
                                                    }
                                            }, n);
                                        })
                                    );
                                    function a() {
                                        return n.apply(this, arguments);
                                    }
                                    return a;
                                })(),
                            });
                        },
                        j = Object(a["ref"])([
                            { title: "昵称", width: "120px", dataIndex: "nick_name" },
                            {
                                title: "头像",
                                width: "100px",
                                dataIndex: "avatar",
                                customRender: function (e) {
                                    var t = e.text;
                                    return Object(a["createVNode"])(
                                        u["a"],
                                        { src: t || "", fallback: h.a, wrapperClassName: "comment-avatar" },
                                        null
                                    );
                                },
                            },
                            { title: "评论内容", width: "180px", dataIndex: "content" },
                            {
                                title: "评论的文章",
                                width: "180px",
                                dataIndex: "article_name",
                                customRender: function (e) {
                                    var t = e.text,
                                        n = e.record;
                                    return Object(a["createVNode"])(
                                        p["a"],
                                        { to: "/article/".concat(n.article_id) },
                                        O(t)
                                            ? t
                                            : {
                                                  default: function () {
                                                      return [t];
                                                  },
                                              }
                                    );
                                },
                            },
                            {
                                title: "审核状态",
                                width: "120px",
                                dataIndex: "approved",
                                customRender: function (e) {
                                    var t = e.text;
                                    return Object(b["a"])(t);
                                },
                            },
                            { title: "邮箱", width: "140px", dataIndex: "email" },
                            { title: "个人网站", width: "160px", dataIndex: "site_url" },
                            {
                                title: "创建时间",
                                width: "140px",
                                dataIndex: "create_time",
                                customRender: function (e) {
                                    var t = e.text;
                                    return Object(v["a"])(t);
                                },
                            },
                            { title: "操作", width: "180px", key: "action", fixed: "right", slots: { customRender: "action" } },
                        ]);
                    return { commentList: e, columns: j, loading: i, onClickLogicDel: o, onClickDel: g, pagination: t };
                },
            });
            n("333a");
            (j.render = o), (j.__scopeId = "data-v-6dec5e60");
            t["default"] = j;
        },
        d04f: function (e, t, n) {
            "use strict";
            n.d(t, "a", function () {
                return d;
            });
            var a = n("d4ec"),
                r = n("bee2"),
                c = n("262e"),
                i = n("2caf"),
                o = n("08ba"),
                u = (function (e) {
                    Object(c["a"])(n, e);
                    var t = Object(i["a"])(n);
                    function n() {
                        return Object(a["a"])(this, n), t.apply(this, arguments);
                    }
                    return (
                        Object(r["a"])(n, [
                            {
                                key: "page",
                                value: function (e) {
                                    return this.$get("page", e);
                                },
                            },
                            {
                                key: "detail",
                                value: function (e) {
                                    return this.$get("detail", { id: e });
                                },
                            },
                            {
                                key: "add",
                                value: function (e) {
                                    return this.$post("add", e);
                                },
                            },
                            {
                                key: "numberOfPeople",
                                value: function () {
                                    return this.$get("number_of_people");
                                },
                            },
                            {
                                key: "total",
                                value: function () {
                                    return this.$get("total");
                                },
                            },
                            {
                                key: "pageAdmin",
                                value: function (e) {
                                    return this.$get("page_admin", e);
                                },
                            },
                            {
                                key: "update",
                                value: function (e) {
                                    return this.$put("update", e);
                                },
                            },
                            {
                                key: "delete",
                                value: function (e) {
                                    return this.$del("delete", { id: e });
                                },
                            },
                            {
                                key: "pageNotApproved",
                                value: function (e) {
                                    return this.$get("page_not_approved", e);
                                },
                            },
                            {
                                key: "review",
                                value: function (e) {
                                    return this.$put("review", e);
                                },
                            },
                        ]),
                        n
                    );
                })(o["a"]),
                d = new u("comment");
        },
        df62: function (e, t, n) {
            e.exports = n.p + "img/comment-avatar.981d30db.svg";
        },
    },
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdmlld3MvYmFja2VuZC9zdHlsZXMvYXZhdGFyLnNjc3M/OGRjYyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZm9ybWF0dGVyLnRzIiwid2VicGFjazovLy8uL3NyYy92aWV3cy9iYWNrZW5kL2NvbW1lbnQvYWxsL2luZGV4LnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvdmlld3MvYmFja2VuZC9jb21tZW50L2FsbC9pbmRleC52dWU/MzUzOCIsIndlYnBhY2s6Ly8vLi9zcmMvdmlld3MvYmFja2VuZC9jb21tZW50L2FsbC9pbmRleC52dWU/MDk3YyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvY29tbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9jb21tZW50LWF2YXRhci5zdmciXSwibmFtZXMiOlsiYXBwcm92ZWRGb3JtYXR0ZXIiLCJ2YWwiLCJjbGFzcyIsInJvdy1rZXkiLCJkYXRhLXNvdXJjZSIsImNvbW1lbnRMaXN0IiwiY29sdW1ucyIsImxvYWRpbmciLCJzY3JvbGwiLCJwYWdpbmF0aW9uIiwiYWN0aW9uIiwicmVjb3JkIiwic2l6ZSIsInR5cGUiLCJkZWxldGVkIiwiZ2hvc3QiLCJvbkNsaWNrTG9naWNEZWwiLCJvbkNsaWNrRGVsIiwibmFtZSIsInNldHVwIiwiY3VycmVudCIsInBhZ2VTaXplIiwidG90YWwiLCJzaG93VG90YWwiLCJvbkNoYW5nZSIsInBhZ2UiLCJzZWFyY2giLCJoYW5kbGVHZXRDb21tZW50cyIsImNvbW1lbnQiLCJwYWdlQWRtaW4iLCJwYWdlTm8iLCJyZXMiLCJ2YWx1ZSIsImRhdGEiLCJ0cmlnZ2VyIiwiaXNEZWxldGVkIiwiY29uZmlybSIsInRpdGxlIiwib25PayIsInVwZGF0ZSIsImlkIiwibWVzc2FnZSIsInN1Y2Nlc3MiLCJkZWxldGUiLCJ3aWR0aCIsImRhdGFJbmRleCIsImN1c3RvbVJlbmRlciIsInRleHQiLCJhcnRpY2xlX2lkIiwia2V5IiwiZml4ZWQiLCJzbG90cyIsInJlbmRlciIsIl9fc2NvcGVJZCIsIkNvbW1lbnRTZXJ2aWNlIiwicGFyYW1zIiwidGhpcyIsIiRnZXQiLCIkcG9zdCIsIiRwdXQiLCIkZGVsIiwiY29tbWVudFNlcnZpY2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiK0dBQUEsVyxvQ0NLTSxTQUFVQSxFQUFrQkMsR0FDOUIsT0FBUUEsR0FDSixLQUFLLEVBQ0QsTUFBTyxLQUNYLEtBQUssRUFDRCxNQUFPLE1BQ1gsS0FBSyxFQUNMLFFBQ0ksTUFBTyxPQWJuQixtQyxtTENLYUMsTUFBTSxzQiwrQkFjd0UsUSx1TkFkdkYseUJBa0JVLFVBbEJWLEVBa0JVLENBakJOLHlCQWdCVSxHQWZOQyxVQUFRLEtBQ1BDLGNBQWEsRUFBQUMsWUFDYkMsUUFBUyxFQUFBQSxRQUNUQyxRQUFTLEVBQUFBLFFBQ1RDLE9BQVEsU0FDUkMsV0FBWSxFQUFBQSxZLENBRUZDLE9BQU0sR0FDYixnQkFEaUJDLEVBQ2pCLEVBRGlCQSxPQUNqQixNQUR1QixDQUN2Qix5QkFLVSxRLFdBSk4saUJBRWEsQ0FGYix5QkFFYSxHQUZIQyxLQUFLLFFBQVNDLEtBQW9CLEdBQWRGLEVBQU9HLFFBQU8sbUJBQThCQyxNQUFBLEdBQU8sUUFBSyxtQkFBRSxFQUFBQyxnQkFBZ0JMLEssWUFBUyxpQkFFL0csQywwREFEZ0IsR0FBZEEsRUFBT0csUUFBTyxzQiw4QkFFbEIseUJBQXNGLEdBQTVFRixLQUFLLFFBQVFDLEtBQUssU0FBU0UsTUFBQSxHQUFPLFFBQUssbUJBQUUsRUFBQUUsV0FBV04sSyxZQUFTLGlCQUFJLEMsb2FDUmhGLG1DQUFnQixDQUMzQk8sS0FBTSxhQUNOQyxNQUYyQixXQUd2QixJQUFNZCxFQUFjLGlCQUFrQixJQUVoQ0ksRUFBYSxzQkFBUyxDQUN4QlcsUUFBUyxFQUNUQyxTQUFVLEdBQ1ZDLE1BQU8sRUFDUEMsVUFBVyxTQUFDRCxHQUFELGtCQUF3QkEsRUFBeEIsTUFDWEUsU0FBVSxTQUFDQyxHQUNQaEIsRUFBV1csUUFBVUssRUFD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LFNBQVUsQ0FBRXBCLFMsNkJBRzFCLFNBQWdCZSxHQUNuQixPQUFPQyxLQUFLQyxLQUErQixvQkFBcUJGLEssb0JBRzdELFNBQU9BLEdBQ1YsT0FBT0MsS0FBS0csS0FBSyxTQUFVSixPLEdBdENOLFFBMENoQk0sRUFBaUIsSUFBSVAsRUFBZSxZLHFCQ25EakRRLEVBQU9DLFFBQVUsSUFBMEIiLCJmaWxlIjoianMvYWxsLWNvbW1lbnQuZDY2Y2I4N2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4vZGlzdC9sb2FkZXIuanM/P3JlZi0tOC1vbmVPZi0xLTAhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tOC1vbmVPZi0xLTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXItdjE2L2Rpc3Qvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3JlZi0tOC1vbmVPZi0xLTIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTgtb25lT2YtMS0zIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLXJlc291cmNlcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS04LW9uZU9mLTEtNCEuL2F2YXRhci5zY3NzP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9NmRlYzVlNjAmbGFuZz1zY3NzJnNjb3BlZD10cnVlXCIiLCIvKipcclxuICogQGF1dGhvcjogVHVzaVxyXG4gKiBAZGVzY3JpcHRpb246IOagvOW8j+WMlu+8jOS7o+abv2ZpbHRlcuWKn+iDvVxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHByb3ZlZEZvcm1hdHRlcih2YWw6IDAgfCAxIHwgMik6IHN0cmluZyB7XHJcbiAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuIFwi6YCa6L+HXCI7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLkuI3pgJrov4dcIjtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIFwi5b6F5a6h5qC4XCI7XHJcbiAgICB9XHJcbn1cclxuIiwiPCEtLVxyXG4gKiBAYXV0aG9yOiBUdXNpXHJcbiAqIEBkZXNjcmlwdGlvbjog5omA5pyJ6K+E6K66XHJcbi0tPlxyXG48dGVtcGxhdGU+XHJcbiAgICA8c2VjdGlvbiBjbGFzcz1cImFkbWluLXBhZ2Utd3JhcHBlclwiPlxyXG4gICAgICAgIDxhLXRhYmxlXHJcbiAgICAgICAgICAgIHJvdy1rZXk9XCJpZFwiXHJcbiAgICAgICAgICAgIDpkYXRhLXNvdXJjZT1cImNvbW1lbnRMaXN0XCJcclxuICAgICAgICAgICAgOmNvbHVtbnM9XCJjb2x1bW5zXCJcclxuICAgICAgICAgICAgOmxvYWRpbmc9XCJsb2FkaW5nXCJcclxuICAgICAgICAgICAgOnNjcm9sbD1cInsgeDogMTUwMCB9XCJcclxuICAgICAgICAgICAgOnBhZ2luYXRpb249XCJwYWdpbmF0aW9uXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSAjYWN0aW9uPVwieyByZWNvcmQgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEtc3BhY2U+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEtYnV0dG9uIHNpemU9XCJzbWFsbFwiIDp0eXBlPVwicmVjb3JkLmRlbGV0ZWQgPT0gMSA/ICdwcmltYXJ5JyA6ICdkYW5nZXInXCIgZ2hvc3QgQGNsaWNrPVwib25DbGlja0xvZ2ljRGVsKHJlY29yZClcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQuZGVsZXRlZCA9PSAxID8gXCLpgLvovpHmgaLlpI1cIiA6IFwi6YC76L6R5Yig6ZmkXCJcclxuICAgICAgICAgICAgICAgICAgICB9fTwvYS1idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEtYnV0dG9uIHNpemU9XCJzbWFsbFwiIHR5cGU9XCJkYW5nZXJcIiBnaG9zdCBAY2xpY2s9XCJvbkNsaWNrRGVsKHJlY29yZClcIj7niannkIbliKDpmaQ8L2EtYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9hLXNwYWNlPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvYS10YWJsZT5cclxuICAgIDwvc2VjdGlvbj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQgbGFuZz1cInRzeFwiPlxyXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIHJlYWN0aXZlLCByZWYgfSBmcm9tIFwidnVlXCI7XHJcbmltcG9ydCB7IG1lc3NhZ2UsIE1vZGFsLCBJbWFnZSB9IGZyb20gXCJhbnQtZGVzaWduLXZ1ZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJMaW5rIH0gZnJvbSBcInZ1ZS1yb3V0ZXJcIjtcclxuaW1wb3J0IHsgQ29tbWVudERUTyB9IGZyb20gXCJAL2JlYW4vZHRvXCI7XHJcbmltcG9ydCB7IHVzZUFzeW5jTG9hZGluZyB9IGZyb20gXCJAL2hvb2tzL2FzeW5jXCI7XHJcbmltcG9ydCB7IGNvbW1lbnRTZXJ2aWNlIH0gZnJvbSBcIkAvc2VydmljZXMvY29tbWVudFwiO1xyXG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tIFwiQC91dGlscy9kYXRlLXV0aWxzXCI7XHJcbmltcG9ydCB7IGFwcHJvdmVkRm9ybWF0dGVyIH0gZnJvbSBcIkAvdXRpbHMvZm9ybWF0dGVyXCI7XHJcbmltcG9ydCBDb21tZW50QXZhdGFyRmFsbGJhY2sgZnJvbSBcIkAvYXNzZXRzL2ltZy9jb21tZW50LWF2YXRhci5zdmdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XHJcbiAgICBuYW1lOiBcIkFsbE1lc3NhZ2VcIixcclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRMaXN0ID0gcmVmPENvbW1lbnREVE9bXT4oW10pO1xyXG5cclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0gcmVhY3RpdmUoe1xyXG4gICAgICAgICAgICBjdXJyZW50OiAxLFxyXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAsXHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBzaG93VG90YWw6ICh0b3RhbDogbnVtYmVyKSA9PiBg5YWx6K6hJHt0b3RhbH3mnaFgLFxyXG4gICAgICAgICAgICBvbkNoYW5nZTogKHBhZ2U6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbi5jdXJyZW50ID0gcGFnZTtcclxuICAgICAgICAgICAgICAgIHNlYXJjaCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDliIbpobXmn6Xor6JcclxuICAgICAgICBjb25zdCBoYW5kbGVHZXRDb21tZW50cyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgY29tbWVudFNlcnZpY2UucGFnZUFkbWluKHtcclxuICAgICAgICAgICAgICAgIHBhZ2VObzogcGFnaW5hdGlvbi5jdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IHBhZ2luYXRpb24ucGFnZVNpemUsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAxLCAvLyAx5Luj6KGo5piv5paH56ug6K+E6K66XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb21tZW50TGlzdC52YWx1ZSA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICBwYWdpbmF0aW9uLnRvdGFsID0gcmVzLnRvdGFsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHsgdHJpZ2dlcjogc2VhcmNoLCBsb2FkaW5nIH0gPSB1c2VBc3luY0xvYWRpbmcoaGFuZGxlR2V0Q29tbWVudHMpO1xyXG5cclxuICAgICAgICAvLyDnm7TmjqXosIPnlKhcclxuICAgICAgICBzZWFyY2goKTtcclxuXHJcbiAgICAgICAgLy8g5aSE55CG6YC76L6R5Yig6ZmkXHJcbiAgICAgICAgY29uc3Qgb25DbGlja0xvZ2ljRGVsID0gKHJlY29yZDogQ29tbWVudERUTykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpc0RlbGV0ZWQgPSByZWNvcmQuZGVsZXRlZCA9PT0gMTtcclxuICAgICAgICAgICAgTW9kYWwuY29uZmlybSh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogYOehruiupOimgeaJp+ihjCR7aXNEZWxldGVkID8gXCLpgLvovpHmgaLlpI1cIiA6IFwi6YC76L6R5Yig6ZmkXCJ95ZCX77yfYCxcclxuICAgICAgICAgICAgICAgIG9uT2s6IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb21tZW50U2VydmljZS51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcmVjb3JkLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkOiBpc0RlbGV0ZWQgPyAwIDogMSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnN1Y2Nlc3MoXCLmk43kvZzmiJDlip9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDlpITnkIbniannkIbliKDpmaRcclxuICAgICAgICBjb25zdCBvbkNsaWNrRGVsID0gKHJlY29yZDogQ29tbWVudERUTykgPT4ge1xyXG4gICAgICAgICAgICBNb2RhbC5jb25maXJtKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuehruiupOimgeWIoOmZpOWQl++8n1wiLFxyXG4gICAgICAgICAgICAgICAgb25PazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbW1lbnRTZXJ2aWNlLmRlbGV0ZShyZWNvcmQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3VjY2VzcyhcIuaTjeS9nOaIkOWKn1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uLmN1cnJlbnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IHJlZihbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuaYteensFwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTIwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJuaWNrX25hbWVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi5aS05YOPXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImF2YXRhclwiLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tUmVuZGVyOiAoeyB0ZXh0IH06IHsgdGV4dDogc3RyaW5nIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPEltYWdlIHNyYz17dGV4dCB8fCBcIlwifSBmYWxsYmFjaz17Q29tbWVudEF2YXRhckZhbGxiYWNrfSB3cmFwcGVyQ2xhc3NOYW1lPVwiY29tbWVudC1hdmF0YXJcIiAvPjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuivhOiuuuWGheWuuVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTgwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJjb250ZW50XCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuivhOiuuueahOaWh+eroFwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTgwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJhcnRpY2xlX25hbWVcIixcclxuICAgICAgICAgICAgICAgIGN1c3RvbVJlbmRlcjogKHsgdGV4dCwgcmVjb3JkIH06IHsgdGV4dDogc3RyaW5nOyByZWNvcmQ6IENvbW1lbnREVE8gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8Um91dGVyTGluayB0bz17YC9hcnRpY2xlLyR7cmVjb3JkLmFydGljbGVfaWR9YH0+e3RleHR9PC9Sb3V0ZXJMaW5rPjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuWuoeaguOeKtuaAgVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTIwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJhcHByb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tUmVuZGVyOiAoeyB0ZXh0IH06IHsgdGV4dDogMSB8IDAgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHByb3ZlZEZvcm1hdHRlcih0ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIumCrueusVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTQwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJlbWFpbFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCLkuKrkurrnvZHnq5lcIixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjE2MHB4XCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6IFwic2l0ZV91cmxcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi5Yib5bu65pe26Ze0XCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxNDBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImNyZWF0ZV90aW1lXCIsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21SZW5kZXI6ICh7IHRleHQgfTogeyB0ZXh0OiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXQodGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCLmk43kvZxcIixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjE4MHB4XCIsXHJcbiAgICAgICAgICAgICAgICBrZXk6IFwiYWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBmaXhlZDogXCJyaWdodFwiLFxyXG4gICAgICAgICAgICAgICAgc2xvdHM6IHsgY3VzdG9tUmVuZGVyOiBcImFjdGlvblwiIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRMaXN0LFxyXG4gICAgICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgICAgICBsb2FkaW5nLFxyXG4gICAgICAgICAgICBvbkNsaWNrTG9naWNEZWwsXHJcbiAgICAgICAgICAgIG9uQ2xpY2tEZWwsXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb24sXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbn0pO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiIHNjb3BlZCBzcmM9XCJAL3ZpZXdzL2JhY2tlbmQvc3R5bGVzL2F2YXRhci5zY3NzXCI+PC9zdHlsZT5cclxuIiwiXHJcbmltcG9ydCB7IGRlZmluZUNvbXBvbmVudCwgcmVhY3RpdmUsIHJlZiB9IGZyb20gXCJ2dWVcIjtcclxuaW1wb3J0IHsgbWVzc2FnZSwgTW9kYWwsIEltYWdlIH0gZnJvbSBcImFudC1kZXNpZ24tdnVlXCI7XHJcbmltcG9ydCB7IFJvdXRlckxpbmsgfSBmcm9tIFwidnVlLXJvdXRlclwiO1xyXG5pbXBvcnQgeyBDb21tZW50RFRPIH0gZnJvbSBcIkAvYmVhbi9kdG9cIjtcclxuaW1wb3J0IHsgdXNlQXN5bmNMb2FkaW5nIH0gZnJvbSBcIkAvaG9va3MvYXN5bmNcIjtcclxuaW1wb3J0IHsgY29tbWVudFNlcnZpY2UgfSBmcm9tIFwiQC9zZXJ2aWNlcy9jb21tZW50XCI7XHJcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gXCJAL3V0aWxzL2RhdGUtdXRpbHNcIjtcclxuaW1wb3J0IHsgYXBwcm92ZWRGb3JtYXR0ZXIgfSBmcm9tIFwiQC91dGlscy9mb3JtYXR0ZXJcIjtcclxuaW1wb3J0IENvbW1lbnRBdmF0YXJGYWxsYmFjayBmcm9tIFwiQC9hc3NldHMvaW1nL2NvbW1lbnQtYXZhdGFyLnN2Z1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcclxuICAgIG5hbWU6IFwiQWxsTWVzc2FnZVwiLFxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudExpc3QgPSByZWY8Q29tbWVudERUT1tdPihbXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSByZWFjdGl2ZSh7XHJcbiAgICAgICAgICAgIGN1cnJlbnQ6IDEsXHJcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMCxcclxuICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIHNob3dUb3RhbDogKHRvdGFsOiBudW1iZXIpID0+IGDlhbHorqEke3RvdGFsfeadoWAsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlOiAocGFnZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uLmN1cnJlbnQgPSBwYWdlO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWIhumhteafpeivolxyXG4gICAgICAgIGNvbnN0IGhhbmRsZUdldENvbW1lbnRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBjb21tZW50U2VydmljZS5wYWdlQWRtaW4oe1xyXG4gICAgICAgICAgICAgICAgcGFnZU5vOiBwYWdpbmF0aW9uLmN1cnJlbnQsXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogcGFnaW5hdGlvbi5wYWdlU2l6ZSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IDEsIC8vIDHku6PooajmmK/mlofnq6Dor4TorrpcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbW1lbnRMaXN0LnZhbHVlID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHBhZ2luYXRpb24udG90YWwgPSByZXMudG90YWw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB0cmlnZ2VyOiBzZWFyY2gsIGxvYWRpbmcgfSA9IHVzZUFzeW5jTG9hZGluZyhoYW5kbGVHZXRDb21tZW50cyk7XHJcblxyXG4gICAgICAgIC8vIOebtOaOpeiwg+eUqFxyXG4gICAgICAgIHNlYXJjaCgpO1xyXG5cclxuICAgICAgICAvLyDlpITnkIbpgLvovpHliKDpmaRcclxuICAgICAgICBjb25zdCBvbkNsaWNrTG9naWNEZWwgPSAocmVjb3JkOiBDb21tZW50RFRPKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzRGVsZXRlZCA9IHJlY29yZC5kZWxldGVkID09PSAxO1xyXG4gICAgICAgICAgICBNb2RhbC5jb25maXJtKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBg56Gu6K6k6KaB5omn6KGMJHtpc0RlbGV0ZWQgPyBcIumAu+i+keaBouWkjVwiIDogXCLpgLvovpHliKDpmaRcIn3lkJfvvJ9gLFxyXG4gICAgICAgICAgICAgICAgb25PazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbW1lbnRTZXJ2aWNlLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByZWNvcmQuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQ6IGlzRGVsZXRlZCA/IDAgOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3VjY2VzcyhcIuaTjeS9nOaIkOWKn1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2goKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIOWkhOeQhueJqeeQhuWIoOmZpFxyXG4gICAgICAgIGNvbnN0IG9uQ2xpY2tEZWwgPSAocmVjb3JkOiBDb21tZW50RFRPKSA9PiB7XHJcbiAgICAgICAgICAgIE1vZGFsLmNvbmZpcm0oe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi56Gu6K6k6KaB5Yig6Zmk5ZCX77yfXCIsXHJcbiAgICAgICAgICAgICAgICBvbk9rOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29tbWVudFNlcnZpY2UuZGVsZXRlKHJlY29yZC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5zdWNjZXNzKFwi5pON5L2c5oiQ5YqfXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb24uY3VycmVudCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gcmVmKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi5pi156ewXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxMjBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcIm5pY2tfbmFtZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCLlpLTlg49cIixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6IFwiYXZhdGFyXCIsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21SZW5kZXI6ICh7IHRleHQgfTogeyB0ZXh0OiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8SW1hZ2Ugc3JjPXt0ZXh0IHx8IFwiXCJ9IGZhbGxiYWNrPXtDb21tZW50QXZhdGFyRmFsbGJhY2t9IHdyYXBwZXJDbGFzc05hbWU9XCJjb21tZW50LWF2YXRhclwiIC8+O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi6K+E6K665YaF5a65XCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxODBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImNvbnRlbnRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi6K+E6K6655qE5paH56ugXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxODBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImFydGljbGVfbmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tUmVuZGVyOiAoeyB0ZXh0LCByZWNvcmQgfTogeyB0ZXh0OiBzdHJpbmc7IHJlY29yZDogQ29tbWVudERUTyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxSb3V0ZXJMaW5rIHRvPXtgL2FydGljbGUvJHtyZWNvcmQuYXJ0aWNsZV9pZH1gfT57dGV4dH08L1JvdXRlckxpbms+O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi5a6h5qC454q25oCBXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxMjBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImFwcHJvdmVkXCIsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21SZW5kZXI6ICh7IHRleHQgfTogeyB0ZXh0OiAxIHwgMCB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcHJvdmVkRm9ybWF0dGVyKHRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi6YKu566xXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxNDBweFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YUluZGV4OiBcImVtYWlsXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuS4quS6uue9keermVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTYwcHhcIixcclxuICAgICAgICAgICAgICAgIGRhdGFJbmRleDogXCJzaXRlX3VybFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCLliJvlu7rml7bpl7RcIixcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhSW5kZXg6IFwiY3JlYXRlX3RpbWVcIixcclxuICAgICAgICAgICAgICAgIGN1c3RvbVJlbmRlcjogKHsgdGV4dCB9OiB7IHRleHQ6IHN0cmluZyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdCh0ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIuaTjeS9nFwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTgwcHhcIixcclxuICAgICAgICAgICAgICAgIGtleTogXCJhY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIGZpeGVkOiBcInJpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBzbG90czogeyBjdXN0b21SZW5kZXI6IFwiYWN0aW9uXCIgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY29tbWVudExpc3QsXHJcbiAgICAgICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgICAgIGxvYWRpbmcsXHJcbiAgICAgICAgICAgIG9uQ2xpY2tMb2dpY0RlbCxcclxuICAgICAgICAgICAgb25DbGlja0RlbCxcclxuICAgICAgICAgICAgcGFnaW5hdGlvbixcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxufSk7XHJcbiIsImltcG9ydCB7IHJlbmRlciB9IGZyb20gXCIuL2luZGV4LnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD02ZGVjNWU2MCZzY29wZWQ9dHJ1ZVwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL2luZGV4LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz10c3hcIlxuZXhwb3J0ICogZnJvbSBcIi4vaW5kZXgudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPXRzeFwiXG5cbmltcG9ydCBcIkAvdmlld3MvYmFja2VuZC9zdHlsZXMvYXZhdGFyLnNjc3M/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD02ZGVjNWU2MCZsYW5nPXNjc3Mmc2NvcGVkPXRydWVcIlxuc2NyaXB0LnJlbmRlciA9IHJlbmRlclxuc2NyaXB0Ll9fc2NvcGVJZCA9IFwiZGF0YS12LTZkZWM1ZTYwXCJcblxuZXhwb3J0IGRlZmF1bHQgc2NyaXB0IiwiLyoqXHJcbiAqIEBhdXRob3I6IFR1c2lcclxuICogQGRlc2NyaXB0aW9uOiDor4TorrrmnI3liqFcclxuICovXHJcbmltcG9ydCB7IEFwaVNlcnZpY2UgfSBmcm9tIFwiQC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBQYWdlUmVzcG9uc2UsIFBsYWluUmVzcG9uc2UsIFF1ZXJ5Q29tbWVudFBhZ2VNb2RlbCwgUXVlcnlQYWdlTW9kZWwsIFJlY29yZFJlc3BvbnNlIH0gZnJvbSBcIkAvYmVhbi94aHJcIjtcclxuaW1wb3J0IHsgQ29tbWVudERUTyB9IGZyb20gXCJAL2JlYW4vZHRvXCI7XHJcbmltcG9ydCB7IFBsYWluT2JqZWN0IH0gZnJvbSBcIkAvYmVhbi9iYXNlXCI7XHJcblxyXG5jbGFzcyBDb21tZW50U2VydmljZSBleHRlbmRzIEFwaVNlcnZpY2Uge1xyXG4gICAgcHVibGljIHBhZ2UocGFyYW1zOiBRdWVyeUNvbW1lbnRQYWdlTW9kZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZ2V0PFBhZ2VSZXNwb25zZTxDb21tZW50RFRPPj4oXCJwYWdlXCIsIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRldGFpbChpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGdldDxSZWNvcmRSZXNwb25zZTxDb21tZW50RFRPPj4oXCJkZXRhaWxcIiwgeyBpZCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHBhcmFtczogUGxhaW5PYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kcG9zdChcImFkZFwiLCBwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBudW1iZXJPZlBlb3BsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZ2V0PFBsYWluUmVzcG9uc2U8bnVtYmVyPj4oXCJudW1iZXJfb2ZfcGVvcGxlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b3RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZ2V0PFBsYWluUmVzcG9uc2U8bnVtYmVyPj4oXCJ0b3RhbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGFnZUFkbWluKHBhcmFtczogUXVlcnlQYWdlTW9kZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZ2V0PFBhZ2VSZXNwb25zZTxDb21tZW50RFRPPj4oXCJwYWdlX2FkbWluXCIsIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShwYXJhbXM6IFBsYWluT2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHB1dChcInVwZGF0ZVwiLCBwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGUoaWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRkZWwoXCJkZWxldGVcIiwgeyBpZCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGFnZU5vdEFwcHJvdmVkKHBhcmFtczogUXVlcnlQYWdlTW9kZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kZ2V0PFBhZ2VSZXNwb25zZTxDb21tZW50RFRPPj4oXCJwYWdlX25vdF9hcHByb3ZlZFwiLCBwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXZpZXcocGFyYW1zOiBQbGFpbk9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRwdXQoXCJyZXZpZXdcIiwgcGFyYW1zKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbW1lbnRTZXJ2aWNlID0gbmV3IENvbW1lbnRTZXJ2aWNlKFwiY29tbWVudFwiKTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL2NvbW1lbnQtYXZhdGFyLjk4MWQzMGRiLnN2Z1wiOyJdLCJzb3VyY2VSb290IjoiIn0=
