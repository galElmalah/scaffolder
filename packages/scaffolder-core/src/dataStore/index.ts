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
	const store = await anAppDataStore(APP_NAME, {initialData:dataShape,useCache:false});
	return store.get('remotes');
};

export const saveRemote = async (name:string, remoteUrl:string) => {
	const store = await anAppDataStore(APP_NAME, {initialData:dataShape,useCache:false});
	const remotes = await store.get('remotes');
	return store.set('remotes', {...remotes, [name]: {
		type:CommandType.REMOTE,
		location:remoteUrl  
	}});
};

export const deleteRemote = async (name:string) => {
	const store = await anAppDataStore(APP_NAME, {initialData:dataShape,useCache:false});
	const remotes = await store.get('remotes');
	delete remotes[name];
	return store.set('remotes', remotes);
};