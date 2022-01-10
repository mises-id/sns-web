/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-12-06 09:34:34
 * @LastEditors: lmk
 * @Description: image test
 */
import React from 'react';
import {shallow} from 'enzyme';
import TouchImage from '.';
describe('TouchImage', () => {
  it('should render correctly', () => {
    const component = shallow(<TouchImage/>)
    expect(component).toMatchSnapshot();
  });
});