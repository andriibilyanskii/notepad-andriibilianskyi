import React, { Component } from 'react';
import NotepadDataService from '../services/notepad.service';

export default class AddNotepad extends Component {
	constructor(props) {
		super(props);
		this.onChangeTitle = this.onChangeTitle.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeMoney = this.onChangeMoney.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.saveNotepad = this.saveNotepad.bind(this);
		this.newNotepad = this.newNotepad.bind(this);

		this.state = {
			title: '',
			description: '',
			money: '',
			date: '',
			published: false,
			submitted: false,
			user: JSON.parse(localStorage.getItem('authentication'))
				? JSON.parse(localStorage.getItem('authentication'))['login']
				: '',
			password: JSON.parse(localStorage.getItem('authentication'))
				? JSON.parse(localStorage.getItem('authentication'))['password']
				: ''
		};

		this.inputTitleRef = React.createRef();
	}

	componentDidMount() {
		this.inputTitleRef.current.focus();
	}

	onChangeTitle(e) {
		this.setState({
			title: e.target.value
		});
	}

	onChangeDescription(e) {
		this.setState({
			description: e.target.value
		});
	}

	onChangeMoney(e) {
		this.setState({
			money: e.target.value
		});
	}

	onChangeDate(e) {
		this.setState({
			date: e.target.value
		});
	}

	saveNotepad(e) {
		e.preventDefault();

		if (!!this.state.user) {
			let data = {
				title: this.state.title,
				description: this.state.description,
				money: this.state.money,
				date: this.state.date,
				published: false,
				user: this.state.user,
				password: this.state.password
			};
			
			if (data.user !== '') {
				NotepadDataService.create(data)
				.then(() => {
					console.log('Created new item successfully!');
					this.setState({
						submitted: true
					});
				})
				.catch((e) => {
					console.log(e);
				});
				
				console.log('Інформація записана');
				
				this.newNotepad();
			}
		} else {
			alert('Зайдіть у свій обліковий запис');
		}
	}

	newNotepad() {
		this.setState({
			title: '',
			description: '',
			money: '',
			date: '',
			published: false,
			submitted: false
		});

		this.inputTitleRef.current.focus();
	}

	render() {
		return (
			<form onSubmit={this.saveNotepad} className='submit-form'>
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

				<button type='submit' className='btn btn-success button-submit'>
					Зберегти
				</button>
			</form>
		);
	}
}
