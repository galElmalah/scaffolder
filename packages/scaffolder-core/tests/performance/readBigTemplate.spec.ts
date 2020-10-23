import { createTemplateStructure,createTemplateStructureSync} from '../../src/createTemplateStructure';


describe('it should take less time then the sync version',  () => {
	it('should take less then 10ms', async () => {
		console.time('START async');
		const struct = await createTemplateStructure(__dirname + '/big-template-example');
		console.timeEnd('START async');
    
		console.time('START SYNC');
		const s = await createTemplateStructureSync(__dirname + '/big-template-example');
		console.timeEnd('START SYNC');
		// console.log(JSON.stringify(struct,null,2));
	});
});