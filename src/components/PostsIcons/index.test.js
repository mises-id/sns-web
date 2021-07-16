/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-16 14:16:42
 * @LastEditors: lmk
 * @Description: PostsIcon test
 */
import React from 'react';
import {shallow} from 'enzyme';
import PostsIcon from './';
describe('PostsIcon', () => {
  it('should render correctly', () => {
    const component = shallow(<PostsIcon />)
    expect(component).toMatchSnapshot();
  });
});