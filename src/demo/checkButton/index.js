import React from 'react';
import {
  Form, Checkbox,Button,Input
} from 'antd';

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
   this.state={
       
   }
  }
  render(){
      const { getFieldDecorator }=this.props.Form;
      return (
          <Form>
              <Form.Item label="用户名">
                {
                    getFieldDecorator('name')(
                        <Input />
                    )
                }
              </Form.Item>
              <label>
                    <Form.Item style={{display:'none'}}>
                        {
                            getFieldDecorator()(
                                <Checkbox/>
                            )
                        }
                    </Form.Item>
                    <Button type="primary">假复选框</Button>
              </label>
          </Form>
      )
  }
 
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

export default WrappedDynamicFieldSet
