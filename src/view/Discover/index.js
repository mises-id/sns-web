/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:31
 * @LastEditTime: 2021-08-14 19:01:06
 * @LastEditors: lmk
 * @Description:
 */
import React, { useState } from 'react';
import { Cell ,Radio} from 'zarm';
const Found = (props)=>{
  const [multiple, setmultiple] = useState(true)
  return <div>
    <Cell title="是否多选">
        <Radio.Group
          compact
          type="button"
          value={multiple}
          onChange={(value) => {
            setmultiple(value);
          }}
        >
          <Radio value={false}>单选</Radio>
          <Radio value={true}>双选</Radio>
        </Radio.Group>
      </Cell>
  </div>
}
export default Found