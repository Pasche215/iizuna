import {expect} from 'chai';
import 'mocha';
import {ConfigRegistry} from "../../../src/helpers/config.registry";


describe('ConfigRegistry Class', () => {
	it('should be declared and be accessible from anywhere', () => {
		expect(typeof ConfigRegistry).to.equal('function');
	});
});