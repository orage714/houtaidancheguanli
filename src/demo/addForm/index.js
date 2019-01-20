import React from 'react';
import {
    Form, Input, Icon, Button, Modal, Row, Col,Card
} from 'antd';
import 'antd/dist/antd.css'
const COND = 'cond';
let cId = 0;
class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);
        this.index=0;
        this.state={
            cardObj: new Map(),
        }
    }
    componentWillMount() {
        this.initCard()
    }
    initCard = () => {//初始化
        cId++
        let vIndex=this.index
        const { cardObj } = this.state;
        let key = COND + cId
        cardObj.set(key, { itemList: [++vIndex] })
        this.index=vIndex;
        this.setState({
            cardObj
        })
    }
    add(item) {
        let vIndex=this.index
        item[1].itemList.push(++vIndex)
        this.index=vIndex
        this.setState({})
    }
    remove = (item, k) => {
       const index=item[1].itemList.indexOf(k)
       item[1].itemList.splice(index,1)
        this.setState({})
    }
    handleSubmit=()=>{
        const {validateFields}=this.props.form;
        validateFields((err,values)=>{
            console.log(values)
        })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { sm: { span: 6 } },
            wrapperCol: {
                sm: { span: 18 },
            },
        };
        const { cardObj } = this.state;
        getFieldDecorator('keys', { initialValue: [...cardObj] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((item) => {
            return <Card title={`表单${item[0]}`} style={{marginBottom:15}}>
                <Form.Item
                    {...formItemLayout}
                    required={false}
                    label={`name${item[0]}`}
                    key={item[0]}
                    style={{width:200}}

                >
                    {getFieldDecorator(`names[${item[0]}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "Please input.",
                        }],
                    })(
                        <Input placeholder={`${item[0]}`} style={{ width: '60%', marginRight: 8 }} />
                    )}
                </Form.Item>
                {item[1].itemList.map((k) => {
                    return <Row>
                        <Col sm={7}>
                            <Form.Item {...formItemLayout} label={`${item[0]}.${k}.name`}>
                                {
                                    getFieldDecorator(`${item[0]}.${k}.name`)(
                                        <Input placeholder={`${item[0]}.${k}.name`} />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col sm={7}>
                            <Form.Item  {...formItemLayout} label={`${item[0]}.${k}.age`}>
                                {
                                    getFieldDecorator(`${item[0]}.${k}.age`)(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col sm={7}>
                            <Form.Item {...formItemLayout} label={`${item[0]}.${k}.sex`}>
                                {
                                    getFieldDecorator(`${item[0]}.${k}.sex`)(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col sm={3}>
                            <Icon
                                className="dynamic-delete-button"
                                type="plus"
                                onClick={() => this.add(item)}
                            />
                            {
                              item[1].itemList.length>1?(
                                <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                // disabled={item[1].itemList.length===1}//老版本不支持所以没有效果
                                onClick={() => this.remove(item, k)}
                            />
                              ):null
                            }
                        </Col>
                    </Row>
                })}
            </Card >

        })
        return (
            <Modal visible={true} title="" onOk={this.handleSubmit}>
                <Form >
                    {formItems}
                    <Form.Item {...formItemLayout}>
                        <Button type="dashed" onClick={this.initCard} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

export default WrappedDynamicFieldSet
