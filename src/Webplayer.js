import React from 'react';
import App from './App';
var SpotifyWebApi = require('spotify-web-api-js');
var spotifyApi = new SpotifyWebApi();

function Webplayer() {
	let playerElement = React.createRef();
	let shuffleState = false;
	let volume = 1;

	spotifyApi.setAccessToken(sessionStorage.token);
	spotifyApi.getUserPlaylists().then(
		function(data) {
			console.log(data.items);
			playerElement.current.setplaylist(data.items);
		},
		function(err) {
			console.error(err);
		}
	);

	window.onSpotifyWebPlaybackSDKReady = () => {
		var player = new window.Spotify.Player({
			name          : 'Laptop',
			getOAuthToken : (callback) => {
				callback(sessionStorage.token);
			},
			volume        : volume
		});

		// COnnect and print device id
		player.connect().then((success) => {
			if (success) {
				console.log('The Web Playback SDK successfully connected to Spotify!');
			}
		});
		player.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
			playerElement.current.setDeviceID(device_id);
		});

		// Listen to change in songs
		try {
			player.addListener('player_state_changed', ({ position, duration, track_window: { current_track } }) => {
				document.getElementById('track').innerHTML = current_track.name;
				console.log('Position in Song', position);
				console.log('Duration of Song', duration);
			});
		} catch (e) {
			console.log('cant get name');
		}

		// Change track functions
		function prevTrack() {
			player.previousTrack().then(() => {
				console.log('Set to previous track!');
			});
		}
		function playPause() {
			player.togglePlay().then(() => {
				console.log('Toggled playback!');
			});
		}
		function nextTrack() {
			player.nextTrack().then(() => {
				console.log('Skipped to next track!');
			});
		}
		document.querySelector('#prevTrack').onclick = prevTrack;
		document.querySelector('#playPause').onclick = playPause;
		document.querySelector('#nextTrack').onclick = nextTrack;
		document.querySelector('#setShuffle').onclick = () => {
			playerElement.current.shuffle(shuffleState);
			shuffleState = !shuffleState;
		};
		var slider = document.getElementById('volume');
		slider.oninput = function() {
			player.setVolume(this.value).then(() => {
				console.log('Volume updated!');
			});
		};
	};

	return (
		<div>
			<App ref={playerElement} spotifyApi={spotifyApi} />
			<h3 id="track">NO SONG</h3>
			<button id="prevTrack">Prev</button>
			<button id="playPause">Play/Pause</button>
			<button id="nextTrack">Next</button>
			<button id="setShuffle">Shuffle</button>
			<input id="volume" type="range" min="0" max="1" step=".1" />
		</div>
	);
}
export default Webplayer;
