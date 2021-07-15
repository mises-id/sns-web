/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-15 10:42:47
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import {shallow} from 'enzyme';
import Image from '.';
describe('Image', () => {
  it('should render correctly', () => {
    const component = shallow(<Image />)
    expect(component).toMatchSnapshot();
  });
});