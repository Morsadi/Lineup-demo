import fire from './firebase';
import 'firebase/database';

const user= process.env.REACT_APP_USER;

const DB_players = fire.database().ref(`${user}/players/`);
const DB_lineup = fire.database().ref(`${user}/lineup/`);
const DB_whereAbouts = fire.database().ref(`${user}/whereAbouts/`);
const DB_assigned_courts = fire.database().ref(`${user}/assigned_courts/`);

// fetching players from the database
export const players = async () => {
  const response = DB_players.once('value');
  const data = await response;
  return data.val();
};
// fetching the lineup from the database
export const lineup = async () => {
  const response = DB_lineup.once('value');
  const data = await response;
  return data.val();
};
// fetching the whereAbouts from the database
export const whereAbouts = async () => {
  const response = DB_whereAbouts.once('value');
  const data = await response;
  return data.val();
};
// fetching the assigned courts from the database
export const assignedCourts = async () => {
  const response = DB_assigned_courts.once('value');
  const data = await response;
  return data.val();
};
