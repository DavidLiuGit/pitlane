// top nav bar

// core
import React, { Component } from 'react';

// Material UI
import Drawer from 'material-ui/Drawer';
//import MenuItem from 'material-ui/MenuItem';
//import RaisedButton from 'material-ui/RaisedButton';


export default class Navbar extends Component {

	constructor(props) {
    super(props);
    this.state = {open: false};
  }

	handleToggle = () => this.setState({open: !this.state.open});
	handleClose  = () => this.setState({open: false});

	render(){
		return (
			<div id="navbar">
				<svg onClick={this.handleToggle}
					id="i-menu" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
					<path d="M4 8 L28 8 M4 16 L28 16 M4 24 L28 24" />
				</svg>
				<span>Home</span>
				<span>News</span>
				<span>Contact</span>

				<Drawer
          docked="false"
          width={350}
          open={this.state.open}
          onRequestClose={(open) => this.setState({open})}
        >
          <span onClick={this.handleClose}>Menu Item</span>
          <span onClick={this.handleClose}>Menu Item 2</span>
        </Drawer>

			</div>
		)
	}
}