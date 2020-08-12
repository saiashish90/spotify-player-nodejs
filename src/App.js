import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './css/styles.css';

const App = forwardRef((props, ref) => {
	const [ playlist, setplaylist ] = useState({});
	const [ deviceID, setDeviceID ] = useState(0);
	function playURI(linkToSong) {
		props.spotifyApi.setAccessToken(sessionStorage.token);
		props.spotifyApi.play({
			device_id   : deviceID,
			context_uri : linkToSong,
			offset      : {
				position : 0
			},
			position_ms : 0
		});
	}
	function shuffle(state) {
		props.spotifyApi.setAccessToken(sessionStorage.token);
		props.spotifyApi.setShuffle(!state);
	}

	useImperativeHandle(ref, () => {
		return {
			setplaylist : setplaylist,
			setDeviceID : setDeviceID,
			shuffle     : shuffle
		};
	});
	let renderItems = [];
	for (let i = 0; i < playlist.length; i++) {
		// name     : playlist[i]._name,
		// href     : playlist[i]._href,
		// id       : playlist[i]._id,
		// uri      : playlist[i]._uri,
		// albumArt : playlist[i]._images[0]
		renderItems.push(
			<div
				className="mb-2 overflow-hidden p-2 text-center text-gray-400 bg-secondary w-1/5 mx-1 shadow-2xl"
				key={playlist[i].id}
			>
				<img className="mx-auto" src={playlist[i].images[0].url} alt="albumart" width="50" height="50" />
				<h5 className="overflow-hidden truncate" width="w-1/3">
					{playlist[i].name}
				</h5>
				<button
					className="bg-primary  align-bottom px-2 py-1 rounded-lg "
					onClick={() => playURI(playlist[i].uri)}
				>
					Play
				</button>
			</div>
		);
	}
	return (
		<div className="my-5 flex flex-row flex-wrap text-center mx-auto justify-between max-w-md">{renderItems}</div>
	);
});

export default App;
