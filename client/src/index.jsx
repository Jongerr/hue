import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import styles from 'styled-components';
import { Divider, Form, Label, Button, Header, Menu } from 'semantic-ui-react'
import { BrowserRouter, HashRouter, Link, Switch, Route, Redirect, withRouter } from 'react-router-dom';

import './style.scss'
import Home from './components/Home.jsx';
import SearchResults from './components/SearchResults.jsx';
import Inbox from './components/Inbox.jsx';
import Login from './components/Login.jsx';
import Submit from './components/Submit.jsx';
import EntryList from './components/EntryList.jsx';
import CommentList from './components/CommentList.jsx';
import Nav from './components/NavBar.jsx';
import UserProfile from './components/UserProfile.jsx';
import Subhue from './components/Subhue.jsx';

const Wrapper = styles.div`
  margin: .7% 8%;
`;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      entries: [],
      subhues: ['home'],
      currentSub: 'home',
      auth: false,
      search: [],
      link: {},
      inbox: []
    }
    this.getInbox = this.getInbox.bind(this);
  }

  componentDidMount() {
    this.getEntries();
    this.getSubhues();
    this.authorize();
  }

  getInbox (user) {
    return axios.post('/inbox', {user: user})
    .then((data) => {
      this.setState({
        inbox: data.data
      })
    })
  }

  getEntries(){
    return axios.get('/entries')
    .then(data => {
      this.setState({entries: data.data})
    });
  }

  getSubhues(){
    return axios.get('/subhues')
    .then(data => {
      this.setState({subhues: data.data});
      console.log('subhues data: ', data.data);
    });
  }

  getEntry(entryid){
    return axios.get(`/entry?id=${entryid}`);
  }

  getComments(entryid){
    return axios.get('/comments', {
      params: {
        entryid: entryid
      }
    });
  }

  getSubhueEntries(subhue) {
    return axios.get(`/subhueEntries?id=${subhue}`);
  }

  getUserEntries(user) {
    return axios.get(`/userEntries?id=${user}`);
  }

  getUserComments(user) {
    return axios.get(`/userComments?id=${user}`);
  }
  
  postEntry(title, url, text, subhue){
    if(url === ''){
      return axios.post('/entries', {
        title: title,
        url: 'none',
        text: text,
        subhue: subhue
      });
    }
    if(this.isURL(url)){
      if(url.slice(0, 4) !== 'http'){
        url = '//' + url;
      }
      return axios.post('/entries', {
        title: title,
        url: url,
        text: text,
        subhue: subhue
      });
    }
  }

  postComment(text, entryid){
    console.log('Comment to post id:', text, entryid);
    return axios.post('/comments', {
      text: text,
      entryid: entryid
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  deleteEntry(entryid){
    return axios.delete(`/entry?id=${entryid}`);
  }

  deleteComment(commentid){
    console.log(commentid);
    return axios.delete(`/comment?id=${commentid}`);
  }
  
  isURL(str){
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)){
      return true;
    }else{
      return false;
    }
  }

  usernameChange(input) {
    this.setState({
      username: input.target.value
    });
  }

  passwordChange(input) {
    this.setState({
      password: input.target.value
    });
  }

  searchQuery (query) {
    axios.post('/search', {query})
    .then((results) => {
      this.setState({
        search: results.data,
        link: {query}
      })
    })
    .catch(() => {
      console.log('No match');
    })
  }

  // Invoked in Login by onSubmitLogin function
  authenticate(url) {
    return axios.post(url, { username: this.state.username, password: this.state.password });
  }
  // Invoked in Login, Submit, UserProfile, and Home by onComponentDidMount lifecycle hook
  authorize() {
    axios.get('/submit').then((res) => {
      this.isAuthorized(res.data);
    });
  }
  // Invoked by authorize
  isAuthorized(res) {
    this.setState({
      auth: res.user
    });
    this.getInbox(res.user);
  }

  render() {
  	return (
      <Wrapper> 
        <Nav 
          user={this.state.auth}
          authenticate={this.authenticate.bind(this)}
          authorize={this.authorize.bind(this)}
          searchQuery={this.searchQuery.bind(this)}
        />
        <Switch className="myList">
          <Route exact path="/" render={(props) => (
            <Home {...props}
              user={this.state.auth}
              data = {this.state.entries}
              authenticate={this.authenticate.bind(this)}
              authorize={this.authorize.bind(this)}
              deleteEntry={this.deleteEntry.bind(this)}
              getEntries={this.getEntries.bind(this)}
            />
          )}/>
          <Route exact path="/subhue/:name" render={props => (
            <Subhue {...props}
              getSubhueEntries={this.getSubhueEntries}
              // user={this.state.auth}
              // deleteEntry={this.deleteEntry.bind(this)}
              // deleteComment={this.deleteComment.bind(this)}
              // getUserComments={this.getUserComments.bind(this)}
              // getUserEntries={this.getUserEntries.bind(this)}
              authorize={this.authorize.bind(this)}
              // getEntry={this.getEntry.bind(this)}
            />
          )}/>
          <Route exact path="/inbox" render={(props) => (
            <Inbox {...props}
              user={this.state.auth}
              inbox={this.state.inbox}
            />
          )}/>
          <Route exact path='/search' render={(props) => (
            <SearchResults {...props}
              data = {this.state.search}
              authenticate={this.authenticate.bind(this)}
              authorize={this.authorize.bind(this)}
              deleteEntry={this.deleteEntry.bind(this)}
              getEntries={this.getEntries.bind(this)}
            />
          )}/>
          <Route exact path="/login" render={(props) => (
            <Login {...props}
              authorize={this.authorize.bind(this)} 
              authenticate={this.authenticate.bind(this)}
              usernameChange={this.usernameChange.bind(this)}
              passwordChange={this.passwordChange.bind(this)}
            />
          )}/> 
          <Route exact path="/submit" render={(props) => (
            this.state.auth !== undefined
            ? <Submit {...props}
              currentSub={this.state.currentSub}
              getEntries={this.getEntries.bind(this)}
              postEntry={this.postEntry.bind(this)}
              authorize={this.authorize.bind(this)}
            />
            : <Redirect to='/login' />
          )}/> 
          <Route exact path="/thread/:id" render={(props) => (
            <CommentList {...props}
              user = {this.state.auth}
              getComments={this.getComments.bind(this)}
              postComment={this.postComment.bind(this)}
              deleteComment={this.deleteComment.bind(this)}
              getEntry={this.getEntry.bind(this)}
            />
          )}/> 
          <Route exact path="/user/:name" render={(props) => (
            <UserProfile {...props}
              user={this.state.auth}
              deleteEntry={this.deleteEntry.bind(this)}
              deleteComment={this.deleteComment.bind(this)}
              getUserComments={this.getUserComments.bind(this)}
              getUserEntries={this.getUserEntries.bind(this)}
              authorize={this.authorize.bind(this)}
              getEntry={this.getEntry.bind(this)}
            />
          )}/> 
        </Switch>
      </Wrapper> 
  	)
  }
}

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('app'))
