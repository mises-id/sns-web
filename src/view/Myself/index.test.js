import React from 'react';
import renderer from 'react-test-renderer';
import Myself from './';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));
describe('Myself', () => {
  it('should render correctly', () => {
    const wrapper = renderer.create(<Myself></Myself>).toJSON()
    expect(wrapper).toMatchSnapshot();
  });
});