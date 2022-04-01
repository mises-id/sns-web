/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-04-01 15:40:09
 * @LastEditors: lmk
 * @Description: Forward page
 */
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavBar, Button, Input, Toast } from "zarm";
import "@/styles/common.scss";
import UserHeader from "../Follows/UserHeader";
import Link from "../Follows/Link";
import { getLink, useBind, useRouteState } from "@/utils";
import { createStatus, getStatusItem } from "@/api/status";
import ImageList from "@/components/ImageList";
import { useDispatch } from "react-redux";
import { setUserSetting } from "@/actions/user";
const Forward = ({ history = {} }) => {
  const [item, setitem] = useState("");
  const { t } = useTranslation();
  const historyState = useRouteState(history);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPosts = useCallback(() => {
    getStatusItem(historyState.id).then((res) => {
      setitem(res);
    });
  });
  const content = useBind("");
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false);
  const submit = () => {
    const form = {
      status_type: "text",
      form_type: "forward",
      content: content.value,
      parent_id: historyState.id,
    };
    setloading(true);
    createStatus(form)
      .then((res) => {
        Toast.show({
          content: t("sendSuccess"),
          stayTime: 1500,
          afterClose: () => {
            window.refreshByCacheKey('/home/following')
            // historyHooks.replace('/home/following')
            setloading(false);
            dispatch(setUserSetting({
              postId:historyState.id,
              data:item.forwards_count+1,
              actionType: 'forward'
            }))
          },
        });
      })
      .catch(() => setloading(false));
  };
  useEffect(() => {
    if (historyState) getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <NavBar
        left={
          <span onClick={() => window.history.back()} className="m-font16">
            {t("cancel")}
          </span>
        }
        right={
          <div style={{ width: "61px" }}>
            <Button
              theme="primary"
              disabled={loading}
              loading={loading}
              onClick={submit}
              block
              size="xs"
              shape="round"
            >
              {t("send")}
            </Button>
          </div>
        }
      />
      <div className="m-layout m-bg-f8f8f8">
        <div className="m-padding15">
          <Input
            type="text"
            rows={5}
            className="m-font17"
            {...content}
            maxLength="4000"
            placeholder={`${t("forwardPlaceholder")}...`}
          />
          {item && (
            <div className="m-bg-fff m-margin-top10">
              <div className="m-padding10">
                <UserHeader
                  size={30}
                  item={{
                    ...item.user,
                    from_type: item.from_type,
                    created_at: item.created_at,
                    is_public: true,
                  }}
                  btnType="empty"
                ></UserHeader>
                {item.content && (
                  <p className="itemContent m-font13 m-margin-tb10 item-eli" dangerouslySetInnerHTML={{ __html: getLink(item.content) }}>
                  </p>
                )}
                {item.status_type === "link" && (
                  <div>
                    {!item.content && <div className="m-margin-bottom10"></div>}
                    <Link theme="primary" item={item.link_meta}></Link>
                  </div>
                )}
              </div>
              {item.images.length > 0 && (
                <div className="m-padding5">
                  <ImageList
                    thumbImages={item.thumb_images}
                    list={item.images}
                    boxWidth={window.innerWidth - 10}
                  ></ImageList>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Forward;
