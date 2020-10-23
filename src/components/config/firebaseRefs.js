import fire from './firebase';
import 'firebase/database';

const user= process.env.REACT_APP_USER;

export const players = fire.database().ref(`${user}/players/`);
export const lineup = fire.database().ref(`${user}/lineup/`);
export const whereAbouts = fire.database().ref(`${user}/whereAbouts/`);
export const assigned_courts = fire.database().ref(`${user}/assigned_courts/`);


