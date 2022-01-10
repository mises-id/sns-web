/*
 * @Author: lmk
 * @Date: 2021-12-02 17:31:24
 * @LastEditTime: 2021-12-02 17:37:47
 * @LastEditors: lmk
 * @Description: 
 */

import React from 'react';
import EditImage from '.';
import {shallow } from 'enzyme';
describe('EditImage', () => {
  it('should render correctly', () => {
    const component = shallow(<EditImage />)
    expect(component).toMatchSnapshot();
  });
});