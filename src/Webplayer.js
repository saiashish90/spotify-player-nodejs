import React from 'react';
import App from './App';
import './css/styles.css';
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
				console.log(current_track.album.images[0]);
				document.getElementById('art').src = current_track.album.images[0].url;
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
			<div className="text-center h-auto p-5 items-center mx-auto max-w-md shadow-2xl bg-secondary">
				<img className="mx-auto" id="art" width="200" height="200" />
				<h3 className="text-xl  text-white" id="track">
					NO SONG
				</h3>
				<div className="text-primary  my-8 text-3xl">
					<button id="setShuffle">
						<i className=" mx-5 bx bx-shuffle" />
					</button>

					<button id="prevTrack">
						<i className="mx-5 bx bxs-skip-previous-circle" />
					</button>
					<button id="playPause">
						<i className="mx-5 bx bx-play-circle" />
					</button>
					<button id="nextTrack">
						<i className="mx-5 bx bxs-skip-next-circle" />
					</button>
					<button id="repeat">
						<i className="mx-5 bx bx-repeat" />
					</button>
				</div>
				<input id="volume" type="range" min="0" max="1" step=".1" />
			</div>
			<App ref={playerElement} spotifyApi={spotifyApi} />
		</div>
	);
}
export default Webplayer;
