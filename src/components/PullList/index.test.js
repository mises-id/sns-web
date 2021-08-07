/*
 * @Author: lmk
 * @Date: 2021-07-15 10:12:21
 * @LastEditTime: 2021-07-23 18:07:31
 * @LastEditors: lmk
 * @Description: image test
 */
import React from 'react';
import {shallow} from 'enzyme';
import PullList from '.';
describe('PullList', () => {
  it('should render correctly', () => {
    const load = Promise.resolve();
    const data = [];
    const renderView = ()=>(<div></div>)
    const component = shallow(<PullList load={load} data={data} renderView={renderView}/>)
    expect(component).toMatchSnapshot();
  });
});