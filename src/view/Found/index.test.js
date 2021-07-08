import React from 'react';
import renderer from 'react-test-renderer';
import Found from './';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));
describe('Found', () => {
  it('should render correctly', () => {
    const wrapper = renderer.create(<Found></Found>).toJSON()
    expect(wrapper).toMatchSnapshot();
  });
});