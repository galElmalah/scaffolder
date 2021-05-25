import { anAppDataStore } from 'app-local-store';
import { CommandEntry, CommandType } from '../commandsBuilder';

const APP_NAME = 'scaffolder';
interface StoreData {
   remotes: Record<string, CommandEntry>
 }

const dataShape: StoreData = {
	remotes: {}
}; 

export const getRemotes = async () => {
	const store = await anAppDataStore(APP_NAME, {initialData:dataShape});
	return store.get('remotes');
};

export const saveRemote = async (name:string, remoteUrl:string) => {
	const store = await anAppDataStore(APP_NAME, {initialData:dataShape});
	const remotes = await store.get('remotes');
	return store.set('remotes', {...remotes, [name]: {
		type:CommandType.REMOTE,
		location:remoteUrl  
	}});
};