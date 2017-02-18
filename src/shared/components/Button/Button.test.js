import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Button from './Button';

describe('Button', () => {
  it('can have a label', () => {
    const wrapper = shallow(<Button text="Accept" />);
    expect(wrapper).to.have.text('Accept');
  });

  it('if it has label, content is ignored', () => {
    const wrapper = shallow(
      <Button text="Accept"><span>Ignored</span></Button>
    );
    expect(wrapper).to.have.text('Accept');
    expect(wrapper).to.have.html().not.match(/Ignored/);
  });

  it('can be set as active', () => {
    const wrapper = shallow(<Button active text="Accept" />);
    expect(wrapper).to.have.className('active');
  });

  it('can have a custom id or class set', () => {
    const wrapper = shallow(
      <Button text="Accept" className="test" id="test1" />
    );
    expect(wrapper).to.have.className('test');
    expect(wrapper).to.have.id('test1');
  });

  it('display types include primary and link', () => {
    const element = display => <Button text="Accept" display={ display } />;
    expect(shallow(element('primary'))).to.have.className('primary');
    expect(shallow(element('link'))).to.have.className('link');
  });

  it('type attribute for forms can be set', () => {
    const element = type => <Button text="Accept" type={ type } />;
    expect(shallow(element('submit'))).to.have.attr('type', 'submit');
    expect(shallow(element('reset'))).to.have.attr('type', 'reset');
  });

  it('can have different sizes', () => {
    const element = size => <Button text="Accept" size={ size } />;
    expect(shallow(element('large'))).to.have.className('large');
    expect(shallow(element('small'))).to.have.className('small');
  });

  it('can span full width', () => {
    const wrapper = shallow(<Button block text="Accept" />);
    expect(wrapper).to.have.className('block');
  });
});
