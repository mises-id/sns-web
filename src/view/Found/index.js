import React, { useReducer, useEffect, useRef, useState } from 'react';
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