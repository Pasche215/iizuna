import {expect} from 'chai';
import 'mocha';
import {GlobalEventListener} from "../../../src/decorators/global-event-listener.decorator";


describe('GlobalEventListener Decorator', () => {
	it('should be declared and be accessible from anywhere', () => {
		expect(typeof GlobalEventListener).to.equal('function');
	});
});