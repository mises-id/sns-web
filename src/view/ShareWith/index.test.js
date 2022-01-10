/*
 * @Author: lmk
 * @Date: 2021-07-16 00:14:28
 * @LastEditTime: 2021-12-31 10:01:11
 * @LastEditors: lmk
 * @Description: MyPost test
 */

import React from 'react';
import ShareWith from './';
import {shallow } from 'enzyme';
describe('shareWith', () => {
  it('should render correctly', () => {
    const component = shallow(<ShareWith />)
    expect(component).toMatchSnapshot();
  });
});