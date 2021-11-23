import React, { Component } from 'react';
import NotepadDataService from '../services/notepad.service';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Notepad extends Component {
	constructor(props) {
		super(props);
		this.onChangeTitle = this.onChangeTitle.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeMoney = this.onChangeMoney.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.updatePublished = this.updatePublished.bind(this);
		this.updateNotepad = this.updateNotepad.bind(this);
		this.deleteNotepad = this.deleteNotepad.bind(this);

		this.state = {
			currentNotepad: {
				key: null,
				title: '',
				description: '',
				money: '',
				date: '',
				published: false
			},
			message: ''
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { notepad } = nextProps;
		if (prevState.currentNotepad.key !== notepad.key) {
			return {
				currentNotepad: notepad,
				message: ''
			};
		}

		return prevState.currentNotepad;
	}

	componentDidMount() {
		this.setState({
			currentNotepad: this.props.notepad
		});
	}

	onChangeTitle(e) {
		const title = e.target.value;

		this.setState(function (prevState) {
			return {
				currentNotepad: {
					...prevState.currentNotepad,
					title: title
				}
			};
		});
	}

	onChangeDescription(e) {
		const description = e.target.value;

		this.setState((prevState) => ({
			currentNotepad: {
				...prevState.currentNotepad,
				description: description
			}
		}));
	}

	onChangeMoney(e) {
		const money = e.target.value;

		this.setState((prevState) => ({
			currentNotepad: {
				...prevState.currentNotepad,
				money: money
			}
		}));
	}

	onChangeDate(e) {
		const date = e.target.value;

		this.setState((prevState) => ({
			currentNotepad: {
				...prevState.currentNotepad,
				date: date
			}
		}));
	}

	updatePublished(status) {
		NotepadDataService.update(this.state.currentNotepad.key, {
			published: status
		})
			.then(() => {
				this.setState((prevState) => ({
					currentNotepad: {
						...prevState.currentNotepad,
						published: status
					},
					message: 'Статус завдання оновлено  '
				}));
			})
			.catch((e) => {
				console.log(e);
			});
	}

	updateNotepad() {
		const data = {
			title: this.state.currentNotepad.title,
			description: this.state.currentNotepad.description,
			money: this.state.currentNotepad.money,
			date: this.state.currentNotepad.date
		};

		NotepadDataService.update(this.state.currentNotepad.key, data)
			.then(() => {
				this.setState({
					message: 'Інформація успішно оновлена'
				});
				setTimeout(() => {
					this.setState({
						message: ''
					});
				}, 5000);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	deleteNotepad() {
		NotepadDataService.delete(this.state.currentNotepad.key)
			.then(() => {
				this.props.refreshList();
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		const { currentNotepad } = this.state;

		return (
			<div>
				<h4> </h4>
				{currentNotepad ? (
					<div className='edit-form'>
						<form>
							<div className='form-group'>
								<label htmlFor='title'>Назва</label>
								<input
									type='text'
									className='form-control'
									id='title'
									required
									value={this.state.title}
									onChange={this.onChangeTitle}
									name='title'
									ref={this.inputTitleRef}
								/>
							</div>

							<div className='form-group'>
								<label htmlFor='description'>Опис</label>
								<input
									type='text'
									className='form-control'
									id='description'
									value={this.state.description}
									onChange={this.onChangeDescription}
									name='description'
								/>
							</div>

							<div className='form-group'>
								<label htmlFor='money'>Кошти</label>
								<input
									type='number'
									className='form-control'
									id='money'
									value={this.state.money}
									onChange={this.onChangeMoney}
									name='money'
								/>
							</div>

							<div className='form-group'>
								<label htmlFor='date'>Дата</label>
								<input
									type='date'
									className='form-control'
									id='date'
									value={this.state.date}
									onChange={this.onChangeDate}
									name='date'
								/>
							</div>

							<div className='form-group'>
								<label>
									<strong>Статус:</strong>
								</label>
								{currentNotepad.published ? ' Зроблено' : ' Не зроблено'}
							</div>
						</form>

						<div className='buttons'>
							{currentNotepad.published ? (
								<button
									className='m-3 btn btn-sm btn-danger listbuttons'
									onClick={() => this.updatePublished(false)}
								>
									Видалити із зроблених
								</button>
							) : (
								<button
									className='m-3 btn btn-sm btn-success listbuttons'
									onClick={() => this.updatePublished(true)}
								>
									Зроблено
								</button>
							)}

							<button
								type='submit'
								className='m-3 btn btn-sm btn-success listbuttons'
								onClick={this.updateNotepad}
							>
								Змінити
							</button>

							<button
								className='m-3 btn btn-sm btn-danger listbuttons'
								onClick={this.deleteNotepad}
							>
								Видалити
							</button>
						</div>
						<p>{this.state.message}</p>
					</div>
				) : (
					<div></div>
				)}
			</div>
		);
	}
}
