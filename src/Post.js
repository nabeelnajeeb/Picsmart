import React from 'react'
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import {useState, useEffect} from 'react';
import {db} from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl}) {
    const[comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
          };
        }, [postId]);

        const postComment = (e) => {
            e.preventDefault();
      
            db.collection("posts").doc(postId).collection("comments").add({
              text: comment,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setComment("");
          };

    return (
        <div className="post">
            <div className="post_header">
            <Avatar className="post_avatar" alt = "UserName" src="https://i.pinimg.com/736x/3b/f8/32/3bf832de12a6da3b55b89137dcc7b3f1.jpg"/>
            <h3>{username}</h3>
        </div>    
            
            <img className="post_image" src={imageUrl} alt=""/>
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>

            <div className="post_Comments">
                {comments.map((comment) => (
                    <p>
                    <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>

            {user &&(
                <form className="post_CommentBox">
                    <input className="post_input" type='text' placeholder='add a comment...' value={comment} 
                        onChange = {(e)=> setComment(e.target.value)}/>
                    <button
                        disabled={!comment}
                        className="post_button"
                        type="submit"
                        onClick={postComment}>Post
                    </button>
                </form>

            )}
            

            
        </div>
    );
}

export default Post;
