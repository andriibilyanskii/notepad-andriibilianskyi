import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Authentication.css';
import { vizhener } from './services/vizhener';

function Authentication() {
	let localStorageAuth = JSON.parse(localStorage.getItem('authentication'));
	let localLogin = localStorageAuth ? localStorageAuth['login'] : '';
	let localPassword = localStorageAuth ? localStorageAuth['password'] : '';

	const [login, setLogin] = useState(localLogin);
	const [password, setPassword] = useState(localPassword);
	let isAuthenticated = false;

	let sumbitButtonRef = React.createRef();

	// useEffect(() => console.log(localStorage));

	return (
		<form
			id='authform'
			onSubmit={(e) => {
				e.preventDefault();
				localStorage.setItem('authentication', JSON.stringify({ login, password }));
				localStorageAuth = JSON.parse(localStorage.getItem('authentication'));
				isAuthenticated = (function () {
					let isAuth = false;
					isAuth = login === localLogin && password === localPassword;
					return isAuth;
				})();

				localStorage.setItem('isAuthenticated', isAuthenticated);

				localStorage.setItem('toshow', 'yes');
				document.location.reload();
			}}
		>
			<div id="formdiv">
				<input
					type='text'
					className='form-control'
					placeholder='Логін'
					required
					onChange={(e) => {
						setLogin(e.target.value);
					}}
					value={login}
				/>
				<input
					type='password'
					className='form-control'
					placeholder='Пароль'
					required
					onChange={(e) => {
						let cryptedValue = vizhener.doCrypt(
							false,
							'BilianskyiAndrii',
							e.target.value
						);
						setPassword(cryptedValue);
					}}
				/>
			</div>
			<input
				type='submit'
				value='Ввійти'
				ref={sumbitButtonRef}
				className='btn btn-success button-submit'
			/>
			<input
				type='button'
				value='Вийти'
				className='btn btn-danger button-submit'
				onClick={() => {
					localStorage.removeItem('authentication');
					localStorage.removeItem('toshow');
					localStorage.setItem('toshow', 'none');
					document.location.reload();
				}}
			/>
		</form>
	);
}

export default Authentication;
