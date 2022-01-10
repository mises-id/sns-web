/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2022-01-04 18:00:12
 * @LastEditors: lmk
 * @Description: image test
 */
import React from 'react';
import {shallow} from 'enzyme';
import ReplyInput from '.';
describe('ReplyInput', () => {
  it('should render correctly', () => {
    const component = shallow(<ReplyInput/>)
    expect(component).toMatchSnapshot();
  });
});