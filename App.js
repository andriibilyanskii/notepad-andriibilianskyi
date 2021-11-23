import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddNotepad from './components/add-notepad.component';
import NotepadsList from './components/notepad-list.component';
import Authentication from './Authentication';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toShow: localStorage.getItem('toshow') || 'none',
		};
	}

	componentDidMount() {
		document.title = 'Інформаційна система для планування графіку, коштів, цілей та бажань';

		setTimeout(() => {
			const webhost = document.querySelector('div[style*="text-align: right;position: fixed;z-index:9999999;bottom: 0;width: auto;right: 1%;cursor: pointer;line-height: 0;display:block !important;"]');
			if (webhost !== null) {
				document.body.removeChild(webhost);
			}
		}, 100);
	}

	componentDidUpdate() {
		setTimeout(() => {
			const webhost = document.querySelector('div[style*="text-align: right;position: fixed;z-index:9999999;bottom: 0;width: auto;right: 1%;cursor: pointer;line-height: 0;display:block !important;"]');
			if (webhost !== null) {
				document.body.removeChild(webhost);
			}
		}, 100);
	}

	render() {
		return (
			<div>
				<Authentication />
				<div className="container mt-3">
					<h2>
						Інформаційна система для планування графіку, коштів, цілей та бажань
					</h2>
					<AddNotepad toShow={this.state.toShow} />
					<NotepadsList toShow={this.state.toShow} />
				</div>
			</div>
		);
	}
}

export default App;
