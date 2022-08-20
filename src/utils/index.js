import { setUserSetting } from "@/actions/user";
import { followed, liked } from "@/components/PostsIcons/common";
import { store } from "@/stores";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Modal } from "zarm";
/*
 * @Author: lmk
 * @Date: 2021-07-15 14:16:46
 * @LastEditTime: 2022-08-20 16:14:18
 * @LastEditors: lmk
 * @Description: project util function
 */
/**
 * @param {*} init set text value
 */
export function useBind(init) {
  let [value, setValue] = useState(init);
  let onChange = useCallback((event) => {
    setValue(event);
  }, []);
  return {
    value,
    onChange,
  };
}
/**
 * @description:
 * @param {*} url
 * @return {*}
 */
export function urlToJson(url = window.location.href) {
  let obj = {},
    index = url.indexOf("?"),
    params = url.substr(index + 1);

  if (index !== -1) {
    // 有参数时
    let parr = params.split("&");
    for (let i of parr) {
      let arr = i.split("=");
      obj[arr[0]] = arr[1];
    }
  }

  return obj;
}

export function objToUrl(object) {
  if (
    JSON.stringify(object).indexOf("{") > -1 &&
    JSON.stringify(object).indexOf("}") > -1
  ) {
    let query = "";
    for (const key in object) {
      const element = object[key];
      if (element) query += `${query === "" ? "?" : "&"}${key}=${element}`;
    }
    return query;
  }
  return "";
}

/**
 * @description:
 * @param {*} funtion fn getdatalist
 * params request data
 * @return {*}
 */

/**
 * @description:
 * @param {*} fn getdatalist
 * @param {*} Get data list using parameters
 * @param {*} type Judge how to add data according to the type
 * @return {*}
 */
export function useList(fn, params = {}, listType = { type: "refresh" }) {
  let [last_id, setlast_id] = useState("");
  const [downRefreshLastId, setdownRefreshLastId] = useState("");
  let [dataSource, setdataSource] = useState([]);
  const fetchData = async (type) => {
    try {
      const isRefresh = type === "refresh";
      const isRefreshList = listType.type === "refreshList";
      if (isRefresh && !isRefreshList) {
        last_id = "";
        setlast_id(last_id);
      }
      const res = await fn({
        ...params,
        last_id: isRefreshList && isRefresh ? downRefreshLastId : last_id,
      });
      const { last_id: lastId } = res.pagination;
      if (isRefresh && listType.type === "refresh") {
        dataSource = [];
      }
      if (isRefresh && isRefreshList) {
        res.data.reverse();
        res.data.forEach((val) => dataSource.unshift(val));
        setdataSource([...dataSource]);
        lastId && setdownRefreshLastId(lastId);
        lastId && setlast_id(lastId);
      } else {
        if (res.data.length !== 0) {
          setdownRefreshLastId(lastId);
        }
        setlast_id(lastId);
        setdataSource([...dataSource, ...res.data]);
      }
      return Promise.resolve({
        ...res,
        listType,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return [
    fetchData,
    last_id,
    dataSource,
    setdataSource,
    downRefreshLastId,
    setdownRefreshLastId,
    setlast_id,
  ];
}
/**
 * @param {*}
 */
export function useRouteState(history) {
  const location = useLocation();
  const { search } = location || {};
  const historyState = urlToJson(search);
  return historyState;
}
/**
 * @param {*}
 */
export function useChangePosts(setdataSource, dataSource, cb) {
  const success = () => {
    if (cb) {
      const data = Array.isArray(dataSource)
        ? [...dataSource]
        : { ...dataSource };
      setdataSource(data);
      cb();
    }
  };
  const [likeLoading, setlikeLoading] = useState(false);
  const setLike = async (val) => {
    try {
      if (likeLoading) return false;
      setlikeLoading(true);
      await liked(val);
      success();
      setlikeLoading(false);
      // updata like flag
      store.dispatch(
        setUserSetting({
          postId: val.id,
          data: val.likes_count,
          actionType: val.is_liked ? "like" : "unlike",
        })
      );
      console.log(val.is_liked ? "like" : "unlike");
    } catch (error) {
      setlikeLoading(false);
      return Promise.reject();
    }
  };
  const [followLoading, setfollowLoading] = useState(false);
  const loginModal = useLoginModal();
  const followPress = async (val, flag) => {
    try {
      const item = flag ? val.parent_status : val;
      if (followLoading) return false;
      setfollowLoading(true);
      await followed(item);
      setfollowLoading(false);
      success();
    } catch (error) {
      console.log(error, 'followPress');
      setfollowLoading(false);
      error === "Wallet not activated" &&
        loginModal(() => {
          followPress(val, flag);
        });
      return Promise.reject();
    }
  };
  return { setLike, followPress };
}

export function useLoginModal() {
  const { t } = useTranslation();
  const loginModal = async (cb) => {
    try {
      // await window.mises.isInitMetaMask()
      const flag = await window.mises.getMisesAccounts();
      // const flag = count > 0;
      const content = flag ? t("notLogin") : t("notRegister");
      Modal.confirm({
        title: "Message",
        content,
        width: "83%",
        onCancel: () => {},
        okText: flag ? "Connect" : "Create",
        onOk: () => {
          window.mises
            .requestAccounts()
            .then(cb)
            .catch((err) => {
              if (err && err.code === -32002) {
                Modal.alert({
                  content:
                    "Please switch to the UNLOCK TAB to unlock your account",
                  width: "77%",
                  title: "Message",
                });
                // Toast.show('Please authorize')
              }
            });
        },
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };
  return loginModal;
}
export const shareWith = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Private",
    value: "private",
  },
  {
    label: "Time Limited Post",
    value: "limited",
  },
];
export function getShareWithObj(value) {
  return shareWith.find((val) => val.value === value) || {};
}

export function username(val = {}, defaultName = "Anonymous") {
  if (val.username) return val.username;
  if (val.misesid && val.misesid.length > 26) {
    const name = `${shortenAddress(val.misesid)}`;
    return name.replace("did:mises:", "");
  }
  return defaultName;
}
export function shortenAddress(address = "") {
  return address ? `${address.slice(0, 18)}...${address.slice(-4)}` : "";
}
export function formatTimeStr(time) {
  if (!time) return "";
  const yesterday = dayjs().subtract(1, "days").format("YYYYMMDD");
  const timeFormat = dayjs(time).format("YYYYMMDD");
  const now = dayjs().format("YYYYMMDD");
  if (now === timeFormat) {
    return dayjs(time).format("HH:mm");
  }
  if (yesterday === timeFormat) {
    return dayjs(time).format("[Yesterday] HH:mm");
  }
  return dayjs(time).format("DD MMM HH:mm");
}
/**
 * @description: set user list follow action
 * @param {Object} dataSource list
 * @param {Function} setdataSource set list
 * @param {String} keyStr key
 * @return {*}
 */
export function useSetDataSourceAction(dataSource, setdataSource, keyStr = "") {
  const user = useSelector((state) => state.user) || { userActions: {} };
  const { uid, postId, actionType } = user.userActions;
  useEffect(() => {
    if (uid || postId) {
      const arr = dataSource.map((val) => {
        let item = keyStr ? val[keyStr] : val;
        switch (actionType) {
          case "comment":
            item = setCommentCountAction(item, user);
            if (item.parent_status) {
              item.parent_status = setCommentCountAction(
                item.parent_status,
                user
              );
            }
            break;
          case "forward":
            item = setForwardCountAction(item, user);
            if (item.parent_status) {
              item.parent_status = setForwardCountAction(
                item.parent_status,
                user
              );
            }
            break;
          case "like":
          case "unlike":
            item = setLikeCountAction(item, user);
            if (item.parent_status) {
              item.parent_status = setLikeCountAction(item.parent_status, user);
            }
            break;
          case "follow":
          case "following":
            item = setFollowAction(item, user);
            if (item.parent_status) {
              item.parent_status = setFollowAction(item.parent_status, user);
            }
            break;

          default:
            break;
        }
        keyStr ? (val[keyStr] = item) : (val = item);
        return val;
      });
      store.dispatch(
        setUserSetting({
          uid: "",
          postId: "",
          data: "",
          actionType: "",
        })
      );
      setdataSource([...arr]);
    }
    // eslint-disable-next-line
  }, [uid, postId]);
  // follow
  const setFollowAction = (val) => {
    const { uid, actionType } = user.userActions;
    if (uid === val.user.uid) val.user.is_followed = actionType === "following";
    return val;
  };
  // comment
  const setCommentCountAction = (val) => {
    const { postId, data } = user.userActions;
    if (postId === val.id) val.comments_count = data;
    return val;
  };
  // forward
  const setForwardCountAction = (val) => {
    const { postId, data } = user.userActions;
    if (postId === val.id) val.forwards_count = data;
    return val;
  };
  // like
  const setLikeCountAction = (val) => {
    const { postId, data } = user.userActions;
    if (postId === val.id) {
      val.likes_count = data;
      val.is_liked = actionType === "like";
    }
    return val;
  };
}

/**
 * @description: hours to  seconds
 * @param {string | number} hour
 * @return {Number } seconds
 */
export function hoursToSeconds(hour) {
  if (!hour) return 0;
  return Number(hour) * 60 * 60;
}
/**
 * @param {*}
 */
export function isMe(user, createdUserId) {
  if (!user || !createdUserId) return false;
  const { loginForm = {} } = store.getState().user;
  return Number(user.uid || createdUserId) === Number(loginForm.uid);
}

// Extract links based on content
export function getLink(content) {
  const reg =
    // eslint-disable-next-line
    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g;
  const result = reg.exec(content);
  const link = result ? result[0] : "";
  //the link according to the link to remove the http/https
  const getOrigin = link.replace(/^(http|https):\/\//, "").substring(0, 25);
  return content
    .replace(
      reg,
      `<a href="${link}" onclick="event.stopPropagation()"  class="link" title="${link}" target="_blank">${getOrigin}${
        link.length > 25 ? "..." : ""
      }</a>`
    )
    .replace(/\n/g, "<br/>");
}

export function numToKMGTPE(num, digits = 1) {
  if (!num) return 0;
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
export function isMisesBrowser() {
  return navigator.userAgent.indexOf("Chrome/77.0.3865.116") >
    -1 || isIos();
}

export function isIos() {
  return !!navigator.userAgent.match(/Mac OS X/) && window.ethereum && window.ethereum.isMetaMask;
}
export function isIosPlatform() {
  return !!navigator.userAgent.match(/Mac OS X/);
}
