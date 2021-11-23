import React, { Component } from 'react';
import NotepadDataService from '../services/notepad.service';
import './list.css';
import Notepad from './notepad.component';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class NotepadsList extends Component {
	constructor(props) {
		super(props);
		this.refreshList = this.refreshList.bind(this);
		this.setActiveNotepad = this.setActiveNotepad.bind(this);
		this.removeAllNotepads = this.removeAllNotepads.bind(this);
		this.onDataChange = this.onDataChange.bind(this);
		this.generateReport = this.generateReport.bind(this);
		this.sortByPublished = this.sortByPublished.bind(this);

		this.state = {
			notepads: [],
			currentNotepad: null,
			currentIndex: -1,
			sorted: localStorage.getItem('sortedNotepads') ? localStorage.getItem('sortedNotepads') : false,
			textSorted: localStorage.getItem('sortedNotepads') ? 'Вимкнути групування' : 'Групувати за зробленими'
		};
	}

	componentDidMount() {
		NotepadDataService.getAll().on('value', this.onDataChange);
	}

	componentWillUnmount() {
		NotepadDataService.getAll().off('value', this.onDataChange);
	}

	onDataChange(items) {
		let notepads = [];

		items.forEach((item) => {
			let key = item.key;
			let data = item.val();
			notepads.push({
				key: key,
				title: data.title,
				description: data.description,
				money: data.money,
				date: data.date,
				published: data.published,
				user: data.user,
				password: data.password
			});
		});

		this.setState({
			notepads: notepads
		});
	}

	refreshList() {
		this.setState({
			currentNotepad: null,
			currentIndex: -1
		});
	}

	setActiveNotepad(notepad, index) {
		this.setState({
			currentNotepad: notepad,
			currentIndex: index
		});
	}

	removeAllNotepads() {
		let localUser = JSON.parse(localStorage.getItem('authentication'))
			? JSON.parse(localStorage.getItem('authentication'))['login']
			: '';
		let localUserPassword = JSON.parse(localStorage.getItem('authentication'))
			? JSON.parse(localStorage.getItem('authentication'))['password']
			: '';
		let deleteNotepads = this.state.notepads.filter(function (e) {
			return e.user === localUser && e.password === localUserPassword;
		});
		deleteNotepads.forEach(function (e) {
			NotepadDataService.delete(e.key)
				.then(() => {
					this.refreshList();
				})
				.catch((e) => {
					console.log(e);
				});
		});
	}

	generateReport() {
		const notepadsArray = this.state.notepads
			.filter(function (notepad) {
				return (
					notepad.user ===
					JSON.parse(
						localStorage.getItem(
							'authentication'
						)
					)['login'] &&
					notepad.password ===
					JSON.parse(
						localStorage.getItem(
							'authentication'
						)
					)['password']
				);
			});

		let information = '';
		let count = 1;
		for (let temp of notepadsArray) {
			information += `Номер: ${count}\nНазва: ${temp.title}\n`;
			if (temp.description) {
				information += `Опис: ${temp.description}\n`;
			}
			if (temp.money) {
				information += `Кошти: ${temp.money}\n`;
			}
			if (temp.date) {
				information += `Дата: ${temp.date}\n`;
			}
			information += `Зроблено: ${temp.published ? 'Так' : 'Ні'}\n\n`;
			count++;
		}

		let pdf = {
			content: information
		}
		pdfMake.createPdf(pdf).download('Notepad.pdf');
	}

	sortByPublished() {
		if (!this.state.sorted) {
			this.setState({
				sorted: true,
				textSorted: 'Вимкнути групування'
			});
			setTimeout(() => {
				localStorage.setItem('sortedNotepads', 'true');
			}, 100);
		} else {
			this.setState({
				sorted: false,
				textSorted: 'Групувати за зробленими'
			});
			setTimeout(() => {
				localStorage.removeItem('sortedNotepads');
			}, 100);
		}
	}

	render() {
		let { notepads, currentNotepad, currentIndex, sorted } = this.state;

		let toRender = '';
		let hasRecords = false;
		notepads.forEach((notepad) => {
			let localUser = JSON.parse(localStorage.getItem('authentication'))
				? JSON.parse(localStorage.getItem('authentication'))['login']
				: '';
			let localUserPassword = JSON.parse(localStorage.getItem('authentication'))
				? JSON.parse(localStorage.getItem('authentication'))['password']
				: '';
			if (notepad.user === localUser && notepad.password === localUserPassword) {
				hasRecords = true;
			}
		});
		if (hasRecords) {
			if (sorted) {
				let notepadsUnPublished = notepads.filter(function (notepad) {
					return !notepad.published;
				});
				let notepadsPublished = notepads.filter(function (notepad) {
					return notepad.published;
				});

				notepads = notepadsUnPublished.concat(notepadsPublished);
			}
			toRender =
				notepads.length !== 0 && this.props.toShow !== 'none' ? (
					<div className='list row notepad-list' key={this.state.key}>
						<div className='col-md-6'>
							<h4>Список</h4>
							<ul className='list-group'>
								{notepads &&
									notepads
										.filter(function (notepad) {
											return (
												notepad.user ===
												JSON.parse(
													localStorage.getItem(
														'authentication'
													)
												)['login'] &&
												notepad.password ===
												JSON.parse(
													localStorage.getItem(
														'authentication'
													)
												)['password']
											);
										})
										.map((notepad, index) => (
											<li
												className={
													'list-group-item ' +
													(index === currentIndex
														? 'active '
														: '') +
													(notepad.published
														? 'published'
														: '') +
													(notepad.date === new Date().toISOString().split('T')[0]
														? ' today'
														: '') +
													(notepad.date === (function () {
														let todaysDate = new Date();
														let d = new Date().getDate() + 1;
														todaysDate.setDate(d);
														let rezult = todaysDate.toISOString().split('T')[0];

														return rezult;
													})()
														? ' tomorrow'
														: '') +
													(notepad.date === (function () {
														let todaysDate = new Date();
														let d = new Date().getDate() - 1;
														todaysDate.setDate(d);
														let rezult = todaysDate.toISOString().split('T')[0];

														return rezult;
													})()
														? ' yesterday'
														: '')
												}
												onClick={() => {
													if (this.state.currentIndex === -1) {
														this.setActiveNotepad(
															notepad,
															index
														)
													} else if (this.state.currentIndex === index) {
														this.setActiveNotepad(
															null,
															-1
														)
													}
												}
												}
												key={index}
											>
												{notepad.title}
											</li>
										))}
							</ul>
							<div className="buttonsAfterList">
								<button
									className='m-3 btn btn-sm btn-danger'
									onClick={this.removeAllNotepads}
								>
									Видалити все
								</button>
								<button
									className='m-3 btn btn-sm btn-success'
									onClick={this.generateReport}
								>
									Згенерувати звіт
								</button>
								<button
									className='m-3 btn btn-sm btn-success'
									onClick={this.sortByPublished}
								>
									{this.state.textSorted}
								</button>
							</div>
						</div>
						<div className='col-md-6'>
							{currentNotepad ? (
								<Notepad
									notepad={currentNotepad}
									refreshList={this.refreshList}
								/>
							) : (
								<div></div>
							)}
						</div>
					</div>
				) : (
					''
				);
		} else if (JSON.parse(localStorage.getItem('authentication'))) {
			toRender = (
				<div className='list row notepad-list'>
					<div className='col-md-6'>
						<h4>Записів ще немає</h4>
					</div>
				</div>
			);
		}

		return <React.Fragment>{toRender}</React.Fragment>;
	}
}
