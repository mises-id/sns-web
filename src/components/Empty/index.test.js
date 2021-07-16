/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-16 14:16:20
 * @LastEditors: lmk
 * @Description: Empty test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Empty from '.';
describe('Empty', () => {
  it('should render correctly', () => {
    const component = shallow(<Empty />)
    expect(component).toMatchSnapshot();
  });
});