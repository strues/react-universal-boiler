import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import TextBlock from './TextBlock';

describe('<TextBlock />', () => {
  it('should add the passed "className" prop to the rendered node if passed.', () => {
    const wrapper = shallow(<TextBlock className="test">My contents</TextBlock>);

    expect(wrapper).to.have.className('test');
  });

  it('should render the children.', () => {
    const wrapper = shallow(<TextBlock>My contents</TextBlock>);

    expect(wrapper.html()).to.contain('My contents');
  });

  it('should propagate props to the wrapper element.', () => {
    const handler = sinon.spy();
    const wrapper = mount(
      <TextBlock onClick={ handler }>My contents</TextBlock>
    );

    wrapper.simulate('click');

    expect(handler.calledOnce).to.equal(true);
  });
});
