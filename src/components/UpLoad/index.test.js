/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2022-01-04 16:43:12
 * @LastEditors: lmk
 * @Description: image test
 */
import React from 'react';
import {shallow} from 'enzyme';
import UpLoad from '.';
describe('UpLoad', () => {
  it('should render correctly', () => {
    const setImageList = ()=>([])
    const component = shallow(<UpLoad imageList={[]} setImageList={setImageList}/>)
    expect(component).toMatchSnapshot();
  });
});