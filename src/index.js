import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './index.css';
import Webplayer from './Webplayer';

let button = (
	<a id="login" href="/login">
		Login
	</a>
);
function getHashParams() {
	var hashParams = {};
	var e,
		r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	while ((e = r.exec(q))) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

if (sessionStorage.token) {
	$.ajax({
		url  : '/refresh_token',
		data : {
			refresh_token : sessionStorage.refresh_token
		}
	}).done(function(data) {
		sessionStorage.token = data.access_token;
	});
	button = <p>Logged in</p>;
	console.log(sessionStorage);
} else if (window.location.hash.split('&')[0].split('=')[1]) {
	var params = getHashParams();
	sessionStorage.refresh_token = params.refresh_token;
	sessionStorage.token = params.access_token;
	var today = new Date();
	var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	sessionStorage.expiresOn = time;
	window.history.replaceState('/', 'Sample Title', '/');
}

setInterval(function() {
	$.ajax({
		url  : '/refresh_token',
		data : {
			refresh_token : sessionStorage.refresh_token
		}
	}).done(function(data) {
		sessionStorage.token = data.access_token;
	});
}, 3000000);

ReactDOM.render(
	<React.StrictMode>
		<Webplayer />
		{button}
	</React.StrictMode>,
	document.getElementById('root')
);
