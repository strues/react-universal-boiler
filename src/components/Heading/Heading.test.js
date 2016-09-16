import React from 'react';
import { shallow, mount } from 'enzyme';
import Heading from './Heading';
import style from './Heading.scss';

describe('<Heading />', () => {
	it('should render the passed children.', () => {
		const wrapper = shallow(<Heading>My Contents</Heading>);

		expect(wrapper.html()).to.include('My Contents');
	});

	it('should add the passed "className" prop to the rendered node if passed.', () => {
		const wrapper = shallow(<Heading className="test">My Contents</Heading>);

		expect(wrapper).to.have.className('test');
	});

	it('should render a semantically first level heading if no type was specified.', () => {
		const wrapper = shallow(<Heading>My Contents</Heading>);

		expect(wrapper.type()).to.equal('h1');
	});

	it('should render the correct heading tag if a type prop was specified.', () => {
		let wrapper = shallow(<Heading type="h2">My Contents</Heading>);

		expect(wrapper.type()).to.equal('h2');

		wrapper = shallow(<Heading type="h4">My Contents</Heading>);
		expect(wrapper.type()).to.equal('h4');
	});
});
