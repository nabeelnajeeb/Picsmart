import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [OpenSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);


  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{  
      if(authUser)
      {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else
      {
        //user has logged out
        setUser(null);
      }                 

    })
    return ()=>{
      //perform some cleanup actions BEFORE the useEffect is refired, so as to prevent creation of duplicate entries
      unsubscribe();
    }
    
  },[user, username]);    //this useEffect here is a listener which listens for any authentication that takes place on the app

  //useEffect -> runs a piece of code under a specific condition
  useEffect(()=>{
    //code body for useEffect
    db.collection('posts').orderBy("timestamp", 'desc').onSnapshot(snapshot =>{
      //in this, every single time a new post is added, this code is triggered and run
      setPosts(snapshot.docs.map(doc=> ({
        id: doc.id,           //making use of the id helps in rendering just the newly added posts, and it wont refresh the enitre application every time
        post: doc.data()
      }))); //this piece of code iterates through all the various docs (in this case, posts) in the collection in the firebase database and maps the function to all those docs
    })
  }, []);  //-> the array given at the end is where the condition(s) is/are specified, and as of now, an empty initialization means the useEffect code body will run just ONCE when the page refreshes
  
  
  const signUp = (event) =>{
    event.preventDefault();       //this is to prevent unnecessary constant refreshes everytime
    auth.createUserWithEmailAndPassword(email, password).then((authUser)=>{
      authUser.user.updateProfile({
        displayName: username,
        //photoURL: imageUrl,
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  } 

  const signIn = (event)=>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch((error)=>alert(error.message));
    setOpenSignIn(false);


  }

  return (
    <div className="App">    

      <Modal 
      open = {open}
      onClose={() => setOpen(false)}      //onClose is for listening for any clicks outside the modal pop-up box so that it closes when clicked outside the box     
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signUp"> 
            <center>
              <img className="app_signUpImage" src="https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-icon-instagram-logo-website-icon-app-icon-22.png" alt=""/>
            </center>  
              <input className="signUpForm" placeholder="E-mail" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}>
              </input>
              <input className="signUpForm"  placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}>
              </input>
              <input className="signUpForm"  placeholder="Username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}>
              </input>
              <Button type="submit" onClick = {signUp}>Sign Up</Button>          
          </form>

        </div>       
      </Modal>

      <Modal 
      open = {OpenSignIn}
      onClose={() => setOpenSignIn(false)}      //onClose is for listening for any clicks outside the modal pop-up box so that it closes when clicked outside the box     
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signUp"> 
            <center>
              <img className="app_signUpImage" src="https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-icon-instagram-logo-website-icon-app-icon-22.png" alt=""/>
            </center>  
              <input className="signUpForm" placeholder="E-mail" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}>
              </input>
              <input className="signUpForm"  placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}>
              </input>
              <Button type="submit" onClick = {signIn}>Sign In</Button>          
          </form>

        </div>       
      </Modal>

      <div className="app_header">
        <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        {user ? 
      (
            <Button onClick={()=>auth.signOut()}>Logout</Button>
      ) : 
      (
          <div className="app_loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>          
      )} 
      </div>

      <div className="app_Posts">
        <div className="app_PostsLeft">
          {
            posts.map(({id,post})=>
              (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>)       //here since we invloved the id, the new post(s) corresponding to that id will only be rendered, not the entire page

            )
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
         
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>

        ):(
          <h3>Sorry, you need to login or sign up to upload/comment.</h3>
        )
      }
            
    </div>
  );
}

export default App;
