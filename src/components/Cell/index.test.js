/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-15 13:46:58
 * @LastEditors: lmk
 * @Description: cell test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Cell from './';
describe('Cell', () => {
  it('should render correctly', () => {
    const props = {
      showIcon:false,
      label:'test',
      iconSize:20
    }
    const component = shallow(<Cell {...props}/>)
    expect(component).toMatchSnapshot();
  });
});