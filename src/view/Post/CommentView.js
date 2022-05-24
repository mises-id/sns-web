import Avatar from '@/components/NFTAvatar';
import { formatTimeStr, isMe, objToUrl, useBind, useLoginModal, username } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import CommentsPop from "@/view/Comment/commentPop";
import ReplyInput from '@/components/ReplyInput';
import { setUserSetting } from '@/actions/user';
import { getComment } from '@/api/status';
import { createComment, likeComment, removeComment, unlikeComment } from '@/api/comment';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from "zarm";
import look from "@/images/look.png";
import { useTranslation } from 'react-i18next';
import deleteComment from "@/images/deleteComment.png";
import commentIcon from "@/images/comment.png";
import liked from "@/images/liked.png";
import like from "@/images/like.png";
import { useHistory } from 'react-router-dom';
/**
 * @description: 
 * @param {*} item Object
 * @param {*} setitem ()=>void
 * @param {*} refresh ()=>void
 * @param {} type post | NFT
 * @return {*}
 */
export const CommentView = ({item,setitem,refresh,type="post"}) => {
  const history = useHistory()
  const { t } = useTranslation();
  const user = useSelector((state) => state.user) || {}; // userinfo 
  const [loading, setloading] = useState(false); // loading flag
  const dispatch = useDispatch()
  const [visible, setvisible] = useState(false);
  const [commentPop, setcommentPop] = useState({})
  const commentContent = useBind("");
  const commentsPopRef = useRef();
  const loginModal = useLoginModal()
  // get this post three comment  data
  const [comment, setcomment] = useState([]);
  const [showMore, setshowMore] = useState(false);
  const [selectItem, setselectItem] = useState({}); // select comment user
  const input = useRef();
  useEffect(() => {
    getCommentList()
    // eslint-disable-next-line
  }, [])
  const getFormId = ()=>{
    const form = {};
    type==='NFT' ? form.nft_asset_id = item.nft_asset_id : form.status_id =  item.id
    return form
  }
  const getCommentList = () => {
    const form = {
      limit: 3,
      ...getFormId()
    }
    
    getComment(form).then((res) => {
      setcomment(res.data);
      setshowMore(!!res.pagination.last_id);
    });
  };
  const commitReply = async ()=>{
    if (loading || !commentContent.value) {
      return false;
    }
    setloading(true);
    try {
      const form = {
        content: commentContent.value,
        parent_id:selectItem.id || '',
        ...getFormId()
      }
      const res = await createComment(form)
      if(selectItem.content){ // if has select item
        const findTopic = comment.find(val=>val.id===(selectItem.topic_id || selectItem.id)) // find top comment
        if(findTopic.comments_count<3){
          findTopic.comments.push(res);
        }
        findTopic.comments_count+=1;
        const findIndex = comment.findIndex(val=>val.id===findTopic.id)
        if(findIndex>-1){
          comment[findIndex] = findTopic;
        }
        setselectItem('')
      }else{
        comment.unshift(res);
      }
      setcomment(comment.slice(0, 3));
      comment.length > 3 && setshowMore(true);
      commentContent.onChange("");
      setloading(false);
      if(refresh){
        const postItem = await refresh(item.id);
        uploadPostDataList(item.id,postItem.comments_count,'comment');
      }
    } catch (error) {
      setloading(false);
    }
  }
  const submit = (e) => {
    e.preventDefault();
    if (!user.token) {
      // Toast.show(t("notLogin"));
      loginModal(commitReply);
      return false;
    }
    commitReply();
  };

  const showMoreComment = (e,val)=>{
    e.stopPropagation()
    setvisible(true)
    const form = {
      ...val,
      ...getFormId()
    }
    setcommentPop(form)
    form.username = username(val.user)
    setselectItem(form)
  }
  const deleteCommentData = (e,val)=>{
    e.stopPropagation()
    Modal.confirm({
      title: 'Message',
      width:'83%',
      content: 'Are you sure to delete this comment?',
      onCancel: () => {
      },
      onOk: () => {
        removeComment(val.id).then(res=>{
          getCommentList(item.id);
          if(visible){  // If the pop is displayed and the first level comment is deleted
            if(!val.topic_id){ // top comment
              setvisible(false)
              setcommentPop({})
              return false;
            }
            if(val.topic_id){ // next comment
              commentsPopRef.current.removeItem(val.id)
            }
          }
          const findItemIndex = comment.findIndex(item=>item.id===(val.topic_id || val.id));
          if(val.topic_id){
            const findChildIndex = comment[findItemIndex].comments.findIndex(item=>item.id===val.id);
            comment[findItemIndex].comments.splice(findChildIndex,1)
            comment[findItemIndex].comments_count-=1
          }
          if(!val.topic_id){
            comment.splice(findItemIndex,1)
            
          }
          item.comments_count-=1
          setitem&&setitem({...item})
          // setcomment([...comment])
          uploadPostDataList(item.id,item.comments_count,'comment')

        }).catch(error=>{
          console.log(error,23213);
        })
      },
    });
  }
  /**
   * @description: upload global list 
   * @param {string} upload postId
   * @param {string} upload data 
   * @param {string} actionType
   * @return {*}
   */
  const uploadPostDataList = (postId,data,type)=>{
    dispatch(setUserSetting({
      postId,
      data,
      actionType: type
    }))
  }
  const userDetail = (e,{user:item})=>{
    e.stopPropagation();
    const isMe = user.loginForm.uid === item.uid;
    if (!isMe) {
      const avatar = item.avatar ? item.avatar.medium : "";
      history.push({
        pathname: "/userDetail",
        search: objToUrl({ uid: item.uid, username: item.username, avatar,is_followed: item.is_followed,misesid:item.misesid }),
      });
    }
  }
  // commit reply
  const replyItem = (val) => {
    if (!user.token) {
      loginModal(()=>{
        selectReplyItem(val)
      })
      return false;
    }
    selectReplyItem(val)
  };
  // click comment user
  const selectReplyItem = val=>{
    commentContent.onChange('')
    val.username = username(val.user)
    setselectItem(val);
    input.current && input.current.focus();
  }
  // get more comment
  const goComment = () => {
    history.push({ pathname: "/comment", 
    search: objToUrl({ ...getFormId(),createdUserId:item.user.uid,count:item.comments_count }) });
  };
  // like function 
  const likeFn = val=>{
    const fn = val.is_liked ? unlikeComment : likeComment;
    fn(val.id)
      .then((res) => {
        val.is_liked = !val.is_liked;
        const findIndex = comment.findIndex((item) => item.id === val.id);
        val.likes_count = val.is_liked ? ++val.likes_count : --val.likes_count;
        if (findIndex > -1) {
          comment[findIndex] = val;
          setcomment([...comment]);
        }
      })
      .catch((res) => {});
  }
  // click like icon button
  const likePress = (e, val) => {
    e.stopPropagation();
    if (!user.token) {
      loginModal(()=>{
        selectReplyItem(()=>likeFn(val))
      })
      return false;
    }
    likeFn(val)
  };
  return <>
    {comment.length > 0 && (
      <div className="m-margin-top10 m-bg-fff m-padding15">
        {comment.map((val, index) => {
          const { comments = [] } = val;
          return (
            <div
              key={index}
              className="m-flex m-col-top m-padding-top13 m-bg-fff"
              onClick={() => replyItem(val)}>
              {/* <Image
                size={30}
                onClick={(e)=>userDetail(e,val)}
                source={val.user.avatar ? val.user.avatar.medium : ""}
              ></Image> */}
              <Avatar onClick={(e)=>userDetail(e,val)} avatarItem={val.user.avatar} size="30px"/>
              <div className="m-margin-left11 m-line-bottom m-flex-1">
                <span className="commentNickname">
                  {username(val.user)}
                </span>
                <div className="m-font15 m-colors-555 m-margin-top8  m-padding-bottom13">
                  <p>{val.content}</p>
                  <div className="m-flex m-row-between m-margin-top8">
                    <div className="m-flex m-row-center">
                      <span className="m-colors-666 m-font12 m-margin-right8">{formatTimeStr((val.created_at))}</span>
                      {isMe(val.user,item.user.uid)&&<img src={deleteComment} alt="" width={12} onClick={e=>deleteCommentData(e,val)}/>}
                    </div>
                    <div className="right-icon m-flex">
                      <div
                        className="m-flex like-box"
                        onClick={(e) => likePress(e, val)}
                      >
                        <img
                          src={val.is_liked ? liked : like}
                          alt="like"
                          width={13}
                        ></img>
                        <span
                          className={`m-font11 m-margin-left8 ${
                            val.is_liked
                              ? "m-colors-FF3D62"
                              : "m-colors-333"
                          }`}
                        >
                          {val.likes_count || 0}
                        </span>
                      </div>
                      <div className="m-flex icon-box">
                        <img
                          src={commentIcon}
                          alt="comment"
                          width={13}
                        ></img>
                        <span
                          className={`m-font11 m-colors-333 m-margin-left8`}
                        >
                          {val.comments_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="all-comment">
                  {comments.map((item, i) => {
                    const { user = {}, content, created_at} = item;
                    const { avatar = {} } = user;
                    return (
                      <div
                        key={i}
                        className="m-flex m-col-top m-bg-fff m-padding-bottom15"
                        onClick={e => {
                          e.stopPropagation()
                          replyItem(item)
                        }}
                      >
                        <Avatar onClick={(e)=>userDetail(e,val)} avatarItem={avatar} size="20px"/>
                        <div className="m-margin-left11 m-flex-1">
                          <div className="m-padding-bottom10">
                            <span className="commentNickname1">
                              {username(user)}{item.opponent&&<span className="at-name">@{username(item.opponent)}</span>}:
                            </span>
                            <span className="comment-content1">{content}</span>
                          </div>
                          <div>
                            <span className="m-colors-666 m-font12 m-margin-right8">{formatTimeStr(created_at)}</span>
                            {isMe(user,item.user.uid)&&<img src={deleteComment} alt="" width={12} onClick={e=>deleteCommentData(e,item)}/>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {val.comments_count > 3 && (
                    <p
                      className="more-comment-list"
                      onClick={(e) => showMoreComment(e,val)}
                    >
                      View all {val.comments_count - comments.length}{" "}
                      comments
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {showMore ? (
          <div className="footerBtn">
            <Button
              shape="round"
              size="sm"
              theme="primary"
              ghost
              block
              onClick={goComment}
            >
              <div className="m-flex m-row-center">
                {t("lookAtAll")}
                <img src={look} alt="look" className="look"></img>
              </div>
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    )}
    <CommentsPop
      visible={visible}
      setvisible={setvisible}
      comment={commentPop}
      replyItem={replyItem}
      setParentSelectItem={setselectItem}
      inputContent={commentContent}
      likePress={likePress}
      createdUserId={item.user ? item.user.uid : ''}
      deleteCommentData={deleteCommentData}
      submit={submit}
      ref={commentsPopRef} />
      <ReplyInput
        submit={submit}
        content={commentContent}
        ref={input}
        setselectItem={setselectItem}
        placeholder={
          selectItem && selectItem.username ? `@${selectItem.username}` : ""
      } />
  </>
}