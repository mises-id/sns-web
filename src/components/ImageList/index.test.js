/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-15 10:42:47
 * @LastEditors: lmk
 * @Description: image test
 */
import React from 'react';
import {shallow} from 'enzyme';
import ImageList from '.';
describe('ImageList', () => {
  it('should render correctly', () => {
    const list = ['https://home.mises.site/upload/attachment/2021/11/18/10/avatar12.png']
    const component = shallow(<ImageList list={list} />)
    expect(component).toMatchSnapshot();
  });
});