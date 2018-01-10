import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Form, Label, Button, Header, Menu } from 'semantic-ui-react'
import EntryList from './EntryList.jsx';



class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.authorize()
  }

  render (props) {
    return (  
      <EntryList data = {this.props.data}/>
    );
  }
}

export default Home;


